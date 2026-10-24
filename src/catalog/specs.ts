import type { ComponentCategory, Project, SpecValue, VehicleType } from '../models/types';

export interface SpecOption {
  value: string;
  label: string;
}

export type SpecField =
  | {
      key: string;
      label: string;
      kind: 'number';
      unit?: string;
      placeholder?: string;
      summary?: boolean;
      vehicles?: VehicleType[];
    }
  | { key: string; label: string; kind: 'text'; placeholder?: string; summary?: boolean; vehicles?: VehicleType[] }
  | { key: string; label: string; kind: 'select'; options: SpecOption[]; summary?: boolean; vehicles?: VehicleType[] }
  | {
      key: string;
      label: string;
      kind: 'multiselect';
      options: SpecOption[];
      hint?: string;
      summary?: boolean;
      vehicles?: VehicleType[];
    }
  | { key: string; label: string; kind: 'boolean'; summary?: boolean; vehicles?: VehicleType[] };

const opts = (...values: string[]): SpecOption[] => values.map((v) => ({ value: v, label: v }));

const MOUNTS = [
  { value: '16', label: '16×16' },
  { value: '20', label: '20×20' },
  { value: '25.5', label: '25.5 whoop' },
  { value: '30.5', label: '30.5×30.5' },
];

const SHAFTS = opts('1 mm', '1.5 mm', '2 mm', '3 mm', '5 mm', 'T-mount');

const VIDEO = [
  { value: 'analog', label: 'Analog' },
  { value: 'walksnail', label: 'Walksnail' },
  { value: 'dji', label: 'DJI' },
  { value: 'hdzero', label: 'HDZero' },
];

const CAMERA_WIDTHS = [
  { value: '14', label: 'Nano 14 mm' },
  { value: '19', label: 'Micro 19 mm' },
  { value: '22', label: 'Full 22 mm' },
];

export const SPEC_FIELDS: Record<ComponentCategory, SpecField[]> = {
  frame: [
    { key: 'maxPropIn', label: 'Max prop size', kind: 'number', unit: 'in', summary: true },
    {
      key: 'fcMountsMm',
      label: 'Stack mounts',
      kind: 'multiselect',
      options: MOUNTS,
      hint: 'Pick every pattern the frame accepts.',
      summary: true,
      vehicles: ['quad'],
    },
    { key: 'motorMountMm', label: 'Motor mount', kind: 'number', unit: 'mm', vehicles: ['quad'] },
    { key: 'cameraWidthMm', label: 'Camera width', kind: 'select', options: CAMERA_WIDTHS },
    {
      key: 'material',
      label: 'Material',
      kind: 'select',
      options: opts('EPP', 'EPO', 'EPS', 'Depron', '3D print', 'Balsa'),
      summary: true,
      vehicles: ['fixed_wing'],
    },
  ],
  fc: [
    { key: 'mountMm', label: 'Mounting pattern', kind: 'select', options: MOUNTS, summary: true },
    {
      key: 'integrated',
      label: 'Built in (AIO)',
      kind: 'multiselect',
      options: [
        { value: 'esc', label: 'ESC' },
        { value: 'rx', label: 'Receiver' },
        { value: 'vtx', label: 'VTX' },
      ],
      hint: 'Built-in parts count as covered, so you don’t need separate ESC, receiver or VTX cards.',
      summary: true,
    },
    { key: 'cellsMin', label: 'Min cells', kind: 'number', unit: 'S' },
    { key: 'cellsMax', label: 'Max cells', kind: 'number', unit: 'S' },
    { key: 'uartCount', label: 'UARTs', kind: 'number' },
    { key: 'target', label: 'Firmware target', kind: 'text', placeholder: 'e.g. MATEKF405' },
  ],
  esc: [
    { key: 'continuousA', label: 'Continuous current', kind: 'number', unit: 'A', summary: true },
    { key: 'burstA', label: 'Burst current', kind: 'number', unit: 'A' },
    { key: 'cellsMin', label: 'Min cells', kind: 'number', unit: 'S' },
    { key: 'cellsMax', label: 'Max cells', kind: 'number', unit: 'S', summary: true },
    { key: 'is4in1', label: '4-in-1 board', kind: 'boolean', summary: true, vehicles: ['quad'] },
    { key: 'mountMm', label: 'Mounting pattern', kind: 'select', options: MOUNTS, vehicles: ['quad'] },
    { key: 'becA', label: 'BEC current', kind: 'number', unit: 'A', summary: true, vehicles: ['fixed_wing'] },
  ],
  motor: [
    { key: 'kv', label: 'KV', kind: 'number', unit: 'KV', summary: true },
    { key: 'statorSize', label: 'Stator size', kind: 'text', placeholder: 'e.g. 2306', summary: true },
    { key: 'maxCurrentA', label: 'Max current', kind: 'number', unit: 'A', summary: true },
    { key: 'shaft', label: 'Shaft / prop mount', kind: 'select', options: SHAFTS },
    { key: 'mountPatternMm', label: 'Mount pattern', kind: 'number', unit: 'mm' },
  ],
  prop: [
    { key: 'diameterIn', label: 'Diameter', kind: 'number', unit: 'in', summary: true },
    { key: 'pitchIn', label: 'Pitch', kind: 'number', unit: 'in', summary: true },
    { key: 'blades', label: 'Blades', kind: 'select', options: opts('2', '3', '4', '5'), summary: true },
    { key: 'mount', label: 'Mount', kind: 'select', options: SHAFTS },
  ],
  servo: [
    { key: 'torqueKgCm', label: 'Torque', kind: 'number', unit: 'kg·cm', summary: true },
    { key: 'speedSec', label: 'Speed', kind: 'number', unit: 's/60°' },
    { key: 'metalGear', label: 'Metal gears', kind: 'boolean', summary: true },
  ],
  vtx: [
    { key: 'system', label: 'System', kind: 'select', options: VIDEO, summary: true },
    { key: 'maxPowerMw', label: 'Max power', kind: 'number', unit: 'mW', summary: true },
    { key: 'inputVMin', label: 'Min input', kind: 'number', unit: 'V' },
    { key: 'inputVMax', label: 'Max input', kind: 'number', unit: 'V' },
    { key: 'mountMm', label: 'Mounting pattern', kind: 'select', options: MOUNTS },
  ],
  camera: [
    { key: 'system', label: 'System', kind: 'select', options: VIDEO, summary: true },
    { key: 'widthMm', label: 'Width', kind: 'select', options: CAMERA_WIDTHS, summary: true },
  ],
  receiver: [
    {
      key: 'protocol',
      label: 'Protocol',
      kind: 'select',
      options: opts('ExpressLRS', 'Crossfire', 'Tracer', 'Ghost', 'FrSky', 'Other'),
      summary: true,
    },
    {
      key: 'band',
      label: 'Band',
      kind: 'select',
      options: opts('2.4 GHz', '868 MHz', '915 MHz', 'Dual band'),
      summary: true,
    },
  ],
  battery: [
    {
      key: 'chemistry',
      label: 'Chemistry',
      kind: 'select',
      options: [
        { value: 'lipo', label: 'LiPo' },
        { value: 'lihv', label: 'LiHV' },
        { value: 'liion', label: 'Li-ion' },
      ],
      summary: true,
    },
    { key: 'cells', label: 'Cells', kind: 'number', unit: 'S', summary: true },
    { key: 'capacityMah', label: 'Capacity', kind: 'number', unit: 'mAh', summary: true },
    { key: 'cRating', label: 'C rating', kind: 'number', unit: 'C' },
    {
      key: 'connector',
      label: 'Connector',
      kind: 'select',
      options: opts('XT60', 'XT30', 'XT90', 'BT2.0', 'PH2.0', 'Other'),
    },
  ],
  gps: [
    { key: 'chipset', label: 'Chipset', kind: 'text', placeholder: 'e.g. M10', summary: true },
    { key: 'hasCompass', label: 'Compass', kind: 'boolean', summary: true },
  ],
  other: [],
};

export function specFieldsFor(category: ComponentCategory, vehicle: VehicleType): SpecField[] {
  return SPEC_FIELDS[category].filter((f) => !f.vehicles || f.vehicles.includes(vehicle));
}

/** Sensible starting quantity for a new part: 4 motors on a quad, servo count on a wing. */
export function defaultQuantity(category: ComponentCategory, project: Project): number {
  if (project.vehicleType === 'quad') {
    if (category === 'motor' || category === 'prop') return project.airframe.motorCount;
    return 1;
  }
  if (category === 'servo') return Math.max(1, project.airframe.servoCount);
  return 1;
}

/** Short one-line spec summary for a part card, e.g. "1950 KV, 2306, 38 A". */
export function summarizeSpecs(
  category: ComponentCategory,
  vehicle: VehicleType,
  specs: Record<string, SpecValue>,
): string {
  const parts: string[] = [];
  for (const field of specFieldsFor(category, vehicle)) {
    if (!field.summary) continue;
    const v = specs[field.key];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    switch (field.kind) {
      case 'number':
        if (typeof v === 'number') parts.push(field.unit ? `${v} ${field.unit}` : String(v));
        break;
      case 'text':
        parts.push(String(v));
        break;
      case 'select':
        parts.push(field.options.find((o) => o.value === v)?.label ?? String(v));
        break;
      case 'multiselect':
        if (Array.isArray(v)) {
          const labels = v.map((x) => field.options.find((o) => o.value === String(x))?.label ?? String(x));
          parts.push(field.key === 'integrated' ? `AIO: ${labels.join(' + ')}` : labels.join(' / '));
        }
        break;
      case 'boolean':
        if (v === true) parts.push(field.label);
        break;
    }
  }
  return parts.join(', ');
}
