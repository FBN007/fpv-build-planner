import { INTEGRATABLE, requiredCategories } from '../catalog/categories';
import type { ComponentCategory, Project } from '../models/types';

/**
 * Categories the build has covered, counting parts integrated on an
 * all-in-one flight controller (spec `integrated: ["esc", "rx", "vtx"]`).
 */
export function coveredCategories(project: Project): Set<ComponentCategory> {
  const covered = new Set<ComponentCategory>();
  for (const c of project.components) {
    covered.add(c.category);
    if (c.category === 'fc') {
      const integrated = c.specs.integrated;
      if (Array.isArray(integrated)) {
        for (const key of integrated) {
          const cat = INTEGRATABLE[String(key)];
          if (cat) covered.add(cat);
        }
      }
    }
  }
  return covered;
}

export interface Coverage {
  required: ComponentCategory[];
  missing: ComponentCategory[];
  filled: number;
}

export function computeCoverage(project: Project): Coverage {
  const required = requiredCategories(project.vehicleType);
  const covered = coveredCategories(project);
  const missing = required.filter((c) => !covered.has(c));
  return { required, missing, filled: required.length - missing.length };
}
