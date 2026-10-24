import { getTemplate } from '../catalog/checklists';
import type { ChecklistItemTemplate, Project } from '../models/types';
import { coveredCategories } from './coverage';

export interface PhaseProgress {
  id: string;
  title: string;
  done: number;
  total: number;
}

export interface NextItem {
  id: string;
  title: string;
  phaseTitle: string;
  critical: boolean;
}

export interface ChecklistSummary {
  done: number;
  total: number;
  /** 0–1. */
  ratio: number;
  phases: PhaseProgress[];
  /** First unchecked item in phase order, or null when everything is done. */
  next: NextItem | null;
}

export function isItemVisible(
  item: ChecklistItemTemplate,
  project: Project,
  covered = coveredCategories(project),
): boolean {
  const when = item.when;
  if (!when) return true;
  if (when.firmware && !when.firmware.includes(project.firmware)) return false;
  if (when.hasCategory && !covered.has(when.hasCategory)) return false;
  if (when.layout) {
    if (project.vehicleType !== 'fixed_wing') return false;
    if (!when.layout.includes(project.airframe.layout)) return false;
  }
  return true;
}

export function summarizeChecklist(project: Project): ChecklistSummary {
  const template = getTemplate(project.checklist.templateId);
  const { progress, customItems } = project.checklist;
  const covered = coveredCategories(project);

  const phases: PhaseProgress[] = [];
  let next: NextItem | null = null;
  let done = 0;
  let total = 0;

  for (const phase of template?.phases ?? []) {
    const items = [
      ...phase.items
        .filter((i) => isItemVisible(i, project, covered))
        .map((i) => ({ id: i.id, title: i.title, critical: !!i.critical })),
      ...customItems.filter((c) => c.phaseId === phase.id).map((c) => ({ id: c.id, title: c.title, critical: false })),
    ];

    let phaseDone = 0;
    for (const item of items) {
      if (progress[item.id]?.done) {
        phaseDone += 1;
      } else if (!next) {
        next = { ...item, phaseTitle: phase.title };
      }
    }

    phases.push({ id: phase.id, title: phase.title, done: phaseDone, total: items.length });
    done += phaseDone;
    total += items.length;
  }

  return { done, total, ratio: total === 0 ? 0 : done / total, phases, next };
}
