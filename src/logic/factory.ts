import { defaultTemplateId } from '../catalog/checklists';
import { FIRMWARE_LABEL, LAYOUT_LABEL } from '../catalog/labels';
import {
  SCHEMA_VERSION,
  type FixedWingAirframe,
  type Firmware,
  type Project,
  type QuadAirframe,
  type WeightOverhead,
} from '../models/types';
import { makeId } from '../utils/id';

interface NewProjectCommon {
  name: string;
  firmware: Firmware;
  currency: string;
}

export type NewProjectInput =
  | (NewProjectCommon & { vehicleType: 'quad'; airframe: QuadAirframe })
  | (NewProjectCommon & { vehicleType: 'fixed_wing'; airframe: FixedWingAirframe });

/** Starting overhead for wires and solder. Foam builds add glue, tape and servo extensions. */
export const DEFAULT_OVERHEAD: Record<Project['vehicleType'], WeightOverhead> = {
  quad: { mode: 'percent', value: 5 },
  fixed_wing: { mode: 'percent', value: 10 },
};

export function createProject(input: NewProjectInput, now = new Date()): Project {
  const iso = now.toISOString();
  const base = {
    id: makeId('prj'),
    schemaVersion: SCHEMA_VERSION,
    name: input.name.trim() || defaultName(input),
    firmware: input.firmware,
    status: 'planning' as const,
    currency: input.currency,
    weightOverhead: { ...DEFAULT_OVERHEAD[input.vehicleType] },
    components: [],
    checklist: { templateId: defaultTemplateId(input.vehicleType), progress: {}, customItems: [] },
    dismissedWarnings: [],
    notes: '',
    createdAt: iso,
    updatedAt: iso,
  };

  return input.vehicleType === 'quad'
    ? { ...base, vehicleType: 'quad', airframe: { ...input.airframe } }
    : { ...base, vehicleType: 'fixed_wing', airframe: { ...input.airframe } };
}

/**
 * Copy a build to plan another one like it. Parts are kept but reset to the
 * wishlist, and checklist progress starts over.
 */
export function duplicateProject(source: Project, now = new Date()): Project {
  const iso = now.toISOString();
  return {
    ...source,
    id: makeId('prj'),
    name: `${source.name} (copy)`,
    status: 'planning' as const,
    components: source.components.map((c) => ({ ...c, id: makeId('cmp'), status: 'wishlist' as const })),
    checklist: { ...source.checklist, progress: {}, customItems: source.checklist.customItems.map((c) => ({ ...c })) },
    dismissedWarnings: [],
    createdAt: iso,
    updatedAt: iso,
  };
}

function defaultName(input: NewProjectInput): string {
  if (input.vehicleType === 'quad') return `${formatInches(input.airframe.propSizeIn)}" quad`;
  return `${LAYOUT_LABEL[input.airframe.layout]} build`;
}

/** "5 inch quad on Betaflight", "800 mm flying wing on INAV". */
export function describeProject(project: Project): string {
  const fw = FIRMWARE_LABEL[project.firmware];
  if (project.vehicleType === 'quad') {
    return `${formatInches(project.airframe.propSizeIn)} inch quad on ${fw}`;
  }
  const { wingspanMm, layout } = project.airframe;
  const span = wingspanMm > 0 ? `${Math.round(wingspanMm)} mm ` : '';
  return `${span}${LAYOUT_LABEL[layout].toLowerCase()} on ${fw}`;
}

function formatInches(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
