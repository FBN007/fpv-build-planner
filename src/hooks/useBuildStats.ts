import { useMemo } from 'react';

import { computeBuildStats, type BuildStats } from '../logic/stats';
import type { Project } from '../models/types';

/** Derived numbers for a project. Recomputes only when the project object changes. */
export function useBuildStats(project: Project | undefined): BuildStats | null {
  return useMemo(() => (project ? computeBuildStats(project) : null), [project]);
}
