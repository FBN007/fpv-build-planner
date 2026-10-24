import { View } from 'react-native';

import type { PhaseProgress as Phase } from '@/logic/checklist';
import { cn } from '@/utils/cn';

interface Props {
  phases: Phase[];
}

/**
 * Checklist progress as one segment per build phase. Segment width follows
 * the phase's item count, so a long setup phase reads as a long stretch of work.
 * Finished phases turn solder-mask green.
 */
export function PhaseProgress({ phases }: Props) {
  const done = phases.reduce((n, p) => n + p.done, 0);
  const total = phases.reduce((n, p) => n + p.total, 0);

  return (
    <View
      className="flex-row gap-1"
      accessibilityRole="progressbar"
      accessibilityLabel="Build checklist"
      accessibilityValue={{ min: 0, max: total, now: done }}
    >
      {phases.map((phase) => {
        const ratio = phase.total === 0 ? 0 : phase.done / phase.total;
        const complete = phase.total > 0 && phase.done === phase.total;
        return (
          <View key={phase.id} style={{ flex: Math.max(phase.total, 1) }} className="h-1.5 overflow-hidden rounded-full bg-raised">
            <View style={{ width: `${ratio * 100}%` }} className={cn('h-full rounded-full', complete ? 'bg-mask' : 'bg-kapton')} />
          </View>
        );
      })}
    </View>
  );
}
