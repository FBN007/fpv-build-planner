import { getCategory } from '../catalog/categories';
import type { BuildComponent, Project } from '../models/types';

export interface BuildTotals {
  totalCost: number;
  /** Ordered, owned and installed parts. Wishlist items are not spent yet. */
  spentCost: number;
  /** Non-battery parts before wire/glue overhead. */
  partsWeightG: number;
  overheadG: number;
  /** Everything except the battery, overhead included. */
  dryWeightG: number;
  batteryWeightG: number;
  /** All-up weight: dry weight plus one flight battery. */
  auwG: number;
  /** g/dm², fixed-wing only and only when wing area is known. */
  wingLoadingGdm2: number | null;
  /** False until at least one part has a weight entered. */
  hasWeights: boolean;
}

const SPENT_STATUSES = new Set(['ordered', 'owned', 'installed']);

export function lineWeight(c: BuildComponent): number {
  return safe(c.unitWeightG) * Math.max(0, safe(c.quantity));
}

export function computeTotals(project: Project): BuildTotals {
  let totalCost = 0;
  let spentCost = 0;
  let partsWeightG = 0;
  let batteryWeightG = 0;

  for (const c of project.components) {
    const cost = safe(c.lineCost);
    totalCost += cost;
    if (SPENT_STATUSES.has(c.status)) spentCost += cost;

    const w = lineWeight(c);
    if (getCategory(c.category).isBattery) {
      // Several battery lines are usually alternatives (a 4S and a 6S pack),
      // not packs flown together. Use the heaviest so the AUW is conservative.
      batteryWeightG = Math.max(batteryWeightG, w);
    } else {
      partsWeightG += w;
    }
  }

  const { mode, value } = project.weightOverhead;
  const overheadG = partsWeightG === 0 ? 0 : mode === 'percent' ? (partsWeightG * safe(value)) / 100 : safe(value);

  const dryWeightG = partsWeightG + overheadG;
  const auwG = dryWeightG + batteryWeightG;

  let wingLoadingGdm2: number | null = null;
  if (project.vehicleType === 'fixed_wing') {
    const area = project.airframe.wingAreaDm2;
    if (area && area > 0 && auwG > 0) wingLoadingGdm2 = auwG / area;
  }

  return {
    totalCost,
    spentCost,
    partsWeightG,
    overheadG,
    dryWeightG,
    batteryWeightG,
    auwG,
    wingLoadingGdm2,
    hasWeights: partsWeightG + batteryWeightG > 0,
  };
}

function safe(n: number): number {
  return Number.isFinite(n) ? n : 0;
}
