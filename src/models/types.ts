// Data model for the FPV Build Planner.
// Only raw user input lives here. Totals, warnings and progress are derived
// in src/logic and never stored.

export const SCHEMA_VERSION = 1;

export type VehicleType = 'quad' | 'fixed_wing';
export type Firmware = 'betaflight' | 'inav' | 'ardupilot';
export type ProjectStatus = 'planning' | 'building' | 'setup' | 'flying';
export type WingLayout = 'flying_wing' | 'conventional' | 'v_tail';

export type ComponentCategory =
  | 'frame'
  | 'fc'
  | 'esc'
  | 'motor'
  | 'prop'
  | 'vtx'
  | 'camera'
  | 'receiver'
  | 'battery'
  | 'gps'
  | 'servo'
  | 'other';

export type ComponentStatus = 'wishlist' | 'ordered' | 'owned' | 'installed';

/** Spec values are typed per category by the field definitions in src/catalog. */
export type SpecValue = string | number | boolean | number[] | string[];

export interface BuildComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  /** Number installed on the aircraft. Weight = unitWeightG × quantity. */
  quantity: number;
  unitWeightG: number;
  /** Total paid for this line. Props and servos usually come in packs. */
  lineCost: number;
  status: ComponentStatus;
  specs: Record<string, SpecValue>;
  link: string;
  notes: string;
}

export interface QuadAirframe {
  propSizeIn: number;
  motorCount: number;
}

export interface FixedWingAirframe {
  layout: WingLayout;
  wingspanMm: number;
  /** Optional. Enables wing loading (g/dm²) when set. */
  wingAreaDm2: number | null;
  servoCount: number;
}

export interface WeightOverhead {
  /** Wires, solder, zip ties, glue, tape, servo extensions. */
  mode: 'percent' | 'grams';
  value: number;
}

export interface ChecklistProgressEntry {
  done: boolean;
  doneAt?: string;
}

export interface CustomChecklistItem {
  id: string;
  phaseId: string;
  title: string;
}

export interface ProjectChecklist {
  templateId: string;
  /** Keyed by template item ID or custom item ID. */
  progress: Record<string, ChecklistProgressEntry>;
  customItems: CustomChecklistItem[];
}

interface ProjectBase {
  id: string;
  schemaVersion: number;
  name: string;
  firmware: Firmware;
  status: ProjectStatus;
  currency: string;
  weightOverhead: WeightOverhead;
  components: BuildComponent[];
  checklist: ProjectChecklist;
  /** Compatibility rule IDs the user has acknowledged. */
  dismissedWarnings: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuadProject extends ProjectBase {
  vehicleType: 'quad';
  airframe: QuadAirframe;
}

export interface FixedWingProject extends ProjectBase {
  vehicleType: 'fixed_wing';
  airframe: FixedWingAirframe;
}

/** Narrow on `vehicleType` to get the right airframe shape. */
export type Project = QuadProject | FixedWingProject;

// ---------------------------------------------------------------------------
// Checklist templates (bundled in code, not stored per project)
// ---------------------------------------------------------------------------

export interface ChecklistCondition {
  firmware?: Firmware[];
  /** Item only shows when the build has a part in this category. */
  hasCategory?: ComponentCategory;
  /** Fixed-wing only: limit to certain airframe layouts. */
  layout?: WingLayout[];
}

export interface ChecklistItemTemplate {
  id: string;
  title: string;
  detail?: string;
  /** Safety-relevant step. Shown with emphasis. */
  critical?: boolean;
  when?: ChecklistCondition;
}

export interface ChecklistPhase {
  id: string;
  title: string;
  items: ChecklistItemTemplate[];
}

export interface ChecklistTemplate {
  id: string;
  version: number;
  vehicleType: VehicleType;
  phases: ChecklistPhase[];
}
