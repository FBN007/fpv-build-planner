import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Readout } from '@/components/ui/Readout';
import type { BuildStats } from '@/logic/stats';
import type { Project } from '@/models/types';
import { formatCost, formatWeight, weightParts } from '@/utils/format';

/** Top-of-workspace numbers: AUW, cost and core-part coverage, with the weight breakdown underneath. */
export function BuildSummary({ project, stats }: { project: Project; stats: BuildStats }) {
  const { totals, coverage } = stats;
  const auw = weightParts(totals.auwG);
  const hasParts = project.components.length > 0;

  const breakdown: string[] = [];
  if (totals.hasWeights) {
    breakdown.push(`Dry ${formatWeight(totals.dryWeightG)}`);
    if (totals.batteryWeightG > 0) breakdown.push(`battery ${formatWeight(totals.batteryWeightG)}`);
    if (totals.overheadG > 0) breakdown.push(`wiring and glue +${formatWeight(totals.overheadG)}`);
  }
  if (totals.wingLoadingGdm2 !== null) breakdown.push(`wing loading ${totals.wingLoadingGdm2.toFixed(1)} g/dm²`);

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row gap-3">
        <Readout
          value={totals.hasWeights ? auw.value : '–'}
          unit={totals.hasWeights ? auw.unit : undefined}
          label="All-up weight"
          empty={!totals.hasWeights}
        />
        <Readout
          value={hasParts ? formatCost(totals.totalCost, project.currency) : '–'}
          label={
            totals.spentCost < totals.totalCost
              ? `${formatCost(totals.spentCost, project.currency)} spent`
              : 'Total cost'
          }
          empty={!hasParts}
        />
        <Readout value={`${coverage.filled}/${coverage.required.length}`} label="Core parts" grow={false} />
      </View>
      {breakdown.length > 0 ? (
        <Text className="text-sm leading-5 text-muted">{capitalize(breakdown.join(', '))}</Text>
      ) : null}
    </Card>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
