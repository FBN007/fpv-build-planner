import type { Project } from '../models/types';
import { summarizeChecklist, type ChecklistSummary } from './checklist';
import { computeCoverage, type Coverage } from './coverage';
import { computeTotals, type BuildTotals } from './totals';

export interface BuildStats {
  totals: BuildTotals;
  coverage: Coverage;
  checklist: ChecklistSummary;
}

/** Everything the UI shows about a build, derived from raw project data. */
export function computeBuildStats(project: Project): BuildStats {
  return {
    totals: computeTotals(project),
    coverage: computeCoverage(project),
    checklist: summarizeChecklist(project),
  };
}
