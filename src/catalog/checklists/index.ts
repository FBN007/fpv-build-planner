import type { ChecklistTemplate, VehicleType } from '../../models/types';
import { fixedWingChecklist } from './fixedWing';
import { quadChecklist } from './quad';

const TEMPLATES: Record<string, ChecklistTemplate> = {
  [quadChecklist.id]: quadChecklist,
  [fixedWingChecklist.id]: fixedWingChecklist,
};

export function defaultTemplateId(vehicleType: VehicleType): string {
  return vehicleType === 'quad' ? quadChecklist.id : fixedWingChecklist.id;
}

export function getTemplate(id: string): ChecklistTemplate | undefined {
  return TEMPLATES[id];
}
