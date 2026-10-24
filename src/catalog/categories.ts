import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { ComponentCategory, VehicleType } from '../models/types';

export interface CategoryMeta {
  id: ComponentCategory;
  label: string;
  /** Label override per vehicle type, e.g. "Foam kit" for fixed-wings. */
  labelFor?: Partial<Record<VehicleType, string>>;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Vehicle types where a build is incomplete without this category. */
  requiredFor: VehicleType[];
  /** Counts towards AUW but not "dry weight". */
  isBattery?: boolean;
}

// Order here is the order categories appear in the workspace.
export const CATEGORIES: CategoryMeta[] = [
  { id: 'frame', label: 'Frame', labelFor: { fixed_wing: 'Foam kit' }, icon: 'vector-square', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'fc', label: 'Flight controller', icon: 'chip', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'esc', label: 'ESC', icon: 'flash-outline', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'motor', label: 'Motors', labelFor: { fixed_wing: 'Motor' }, icon: 'fan', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'prop', label: 'Propellers', labelFor: { fixed_wing: 'Propeller' }, icon: 'rotate-3d-variant', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'servo', label: 'Servos', icon: 'axis-arrow', requiredFor: ['fixed_wing'] },
  { id: 'vtx', label: 'Video transmitter', icon: 'access-point', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'camera', label: 'Camera', icon: 'camera-outline', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'receiver', label: 'Receiver', icon: 'antenna', requiredFor: ['quad', 'fixed_wing'] },
  { id: 'battery', label: 'Battery', icon: 'battery-high', requiredFor: ['quad', 'fixed_wing'], isBattery: true },
  { id: 'gps', label: 'GPS', icon: 'crosshairs-gps', requiredFor: [] },
  { id: 'other', label: 'Other parts', icon: 'package-variant-closed', requiredFor: [] },
];

const BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<ComponentCategory, CategoryMeta>;

export function getCategory(id: ComponentCategory): CategoryMeta {
  return BY_ID[id];
}

export function categoryLabel(id: ComponentCategory, vehicleType: VehicleType): string {
  const meta = BY_ID[id];
  return meta.labelFor?.[vehicleType] ?? meta.label;
}

/** Categories shown for a vehicle type (servos are hidden on quads). */
export function categoriesFor(vehicleType: VehicleType): CategoryMeta[] {
  return CATEGORIES.filter((c) => !(vehicleType === 'quad' && c.id === 'servo'));
}

export function requiredCategories(vehicleType: VehicleType): ComponentCategory[] {
  return CATEGORIES.filter((c) => c.requiredFor.includes(vehicleType)).map((c) => c.id);
}

/**
 * Categories an all-in-one flight controller can cover through its
 * `integrated` spec, e.g. a whoop AIO with ESC and ELRS receiver on board.
 */
export const INTEGRATABLE: Record<string, ComponentCategory> = {
  esc: 'esc',
  rx: 'receiver',
  vtx: 'vtx',
};
