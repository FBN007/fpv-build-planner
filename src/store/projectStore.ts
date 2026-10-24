import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createProject, duplicateProject, type NewProjectInput } from '../logic/factory';
import {
  SCHEMA_VERSION,
  type BuildComponent,
  type FixedWingAirframe,
  type Project,
  type QuadAirframe,
} from '../models/types';
import { makeId } from '../utils/id';

export type ProjectPatch = Partial<
  Pick<Project, 'name' | 'firmware' | 'status' | 'currency' | 'weightOverhead' | 'notes' | 'dismissedWarnings'>
>;

export type NewComponent = Omit<BuildComponent, 'id'>;
export type ComponentPatch = Partial<Omit<BuildComponent, 'id'>>;

interface ProjectState {
  projects: Record<string, Project>;

  createProject: (input: NewProjectInput) => string;
  updateProject: (id: string, patch: ProjectPatch) => void;
  updateAirframe: (id: string, airframe: QuadAirframe | FixedWingAirframe) => void;
  duplicateProject: (id: string) => string | null;
  deleteProject: (id: string) => void;

  addComponent: (projectId: string, component: NewComponent) => string | null;
  updateComponent: (projectId: string, componentId: string, patch: ComponentPatch) => void;
  removeComponent: (projectId: string, componentId: string) => void;

  setChecklistItem: (projectId: string, itemId: string, done: boolean) => void;
}

/** Apply a change to one project and bump its updatedAt. No-op if it doesn't exist. */
function withProject(
  state: ProjectState,
  id: string,
  change: (p: Project) => Project,
): Pick<ProjectState, 'projects'> | ProjectState {
  const current = state.projects[id];
  if (!current) return state;
  const next = { ...change(current), updatedAt: new Date().toISOString() } as Project;
  return { projects: { ...state.projects, [id]: next } };
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: {},

      createProject: (input) => {
        const project = createProject(input);
        set((s) => ({ projects: { ...s.projects, [project.id]: project } }));
        return project.id;
      },

      updateProject: (id, patch) => set((s) => withProject(s, id, (p) => ({ ...p, ...patch }) as Project)),

      updateAirframe: (id, airframe) =>
        set((s) =>
          withProject(s, id, (p) => {
            // Refuse a quad airframe on a wing and vice versa.
            const isWing = 'layout' in airframe;
            if (isWing !== (p.vehicleType === 'fixed_wing')) return p;
            return { ...p, airframe: { ...airframe } } as Project;
          }),
        ),

      duplicateProject: (id) => {
        const source = get().projects[id];
        if (!source) return null;
        const copy = duplicateProject(source);
        set((s) => ({ projects: { ...s.projects, [copy.id]: copy } }));
        return copy.id;
      },

      deleteProject: (id) =>
        set((s) => {
          if (!s.projects[id]) return s;
          const { [id]: _removed, ...rest } = s.projects;
          return { projects: rest };
        }),

      addComponent: (projectId, component) => {
        if (!get().projects[projectId]) return null;
        const id = makeId('cmp');
        set((s) => withProject(s, projectId, (p) => ({ ...p, components: [...p.components, { ...component, id }] })));
        return id;
      },

      updateComponent: (projectId, componentId, patch) =>
        set((s) =>
          withProject(s, projectId, (p) => ({
            ...p,
            components: p.components.map((c) => (c.id === componentId ? { ...c, ...patch } : c)),
          })),
        ),

      removeComponent: (projectId, componentId) =>
        set((s) =>
          withProject(s, projectId, (p) => ({
            ...p,
            components: p.components.filter((c) => c.id !== componentId),
          })),
        ),

      setChecklistItem: (projectId, itemId, done) =>
        set((s) =>
          withProject(s, projectId, (p) => ({
            ...p,
            checklist: {
              ...p.checklist,
              progress: {
                ...p.checklist.progress,
                [itemId]: done ? { done: true, doneAt: new Date().toISOString() } : { done: false },
              },
            },
          })),
        ),
    }),
    {
      name: 'fpv-build-planner',
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      // Only data is persisted; actions are recreated on load.
      partialize: (state) => ({ projects: state.projects }),
      // Bump SCHEMA_VERSION and transform `persisted` here when the model changes.
      migrate: (persisted) => persisted as { projects: Record<string, Project> },
    },
  ),
);
