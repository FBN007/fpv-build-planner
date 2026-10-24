import type { ComponentStatus, Firmware, ProjectStatus, VehicleType, WingLayout } from '../models/types';

export const VEHICLE_LABEL: Record<VehicleType, string> = {
  quad: 'Quad',
  fixed_wing: 'Fixed-wing',
};

export const FIRMWARE_LABEL: Record<Firmware, string> = {
  betaflight: 'Betaflight',
  inav: 'INAV',
  ardupilot: 'ArduPilot',
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: 'Planning',
  building: 'Building',
  setup: 'Setup',
  flying: 'Flying',
};

export const LAYOUT_LABEL: Record<WingLayout, string> = {
  flying_wing: 'Flying wing',
  conventional: 'Conventional',
  v_tail: 'V-tail',
};

export const COMPONENT_STATUS_LABEL: Record<ComponentStatus, string> = {
  wishlist: 'Wishlist',
  ordered: 'Ordered',
  owned: 'Owned',
  installed: 'Installed',
};

/** Typical servo count for each layout: elevons, or ailerons + tail. */
export const DEFAULT_SERVOS: Record<WingLayout, number> = {
  flying_wing: 2,
  conventional: 4,
  v_tail: 4,
};

export const DEFAULT_FIRMWARE: Record<VehicleType, Firmware> = {
  quad: 'betaflight',
  fixed_wing: 'inav',
};

export const PROP_SIZES_IN = [2, 2.5, 3, 3.5, 4, 5, 6, 7, 10];

export const CURRENCIES = ['DKK', 'EUR', 'USD', 'GBP', 'SEK', 'NOK'];
