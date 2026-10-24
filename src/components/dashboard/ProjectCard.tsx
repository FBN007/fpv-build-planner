import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PhaseProgress } from '@/components/ui/PhaseProgress';
import { Readout } from '@/components/ui/Readout';
import { VehicleGlyph } from '@/components/ui/VehicleGlyph';
import { STATUS_LABEL } from '@/catalog/labels';
import { useBuildStats } from '@/hooks/useBuildStats';
import { describeProject } from '@/logic/factory';
import type { Project, ProjectStatus } from '@/models/types';
import palette from '@/theme/palette';
import { formatCost, weightParts } from '@/utils/format';

const STATUS_TONE: Record<ProjectStatus, BadgeTone> = {
  planning: 'neutral',
  building: 'accent',
  setup: 'accent',
  flying: 'ok',
};

interface Props {
  project: Project;
  onPress: (project: Project) => void;
  onLongPress: (project: Project) => void;
}

function ProjectCardBase({ project, onPress, onLongPress }: Props) {
  const stats = useBuildStats(project);
  if (!stats) return null;

  const { totals, coverage, checklist } = stats;
  const weight = weightParts(totals.auwG);
  const next = checklist.next;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens the build. Long press for more actions."
      onPress={() => onPress(project)}
      onLongPress={() => onLongPress(project)}
      delayLongPress={350}
      className="active:opacity-90"
    >
      <Card className="p-4">
        <View className="flex-row items-start gap-3">
          <VehicleGlyph type={project.vehicleType} />
          <View className="flex-1">
            <Text className="font-display-bold text-xl text-ink" numberOfLines={1}>
              {project.name}
            </Text>
            <Text className="text-sm text-muted" numberOfLines={1}>
              {describeProject(project)}
            </Text>
          </View>
          <Badge label={STATUS_LABEL[project.status]} tone={STATUS_TONE[project.status]} />
        </View>

        <View className="mt-4 flex-row gap-3">
          <Readout
            value={totals.hasWeights ? weight.value : '–'}
            unit={totals.hasWeights ? weight.unit : undefined}
            label="All-up weight"
            empty={!totals.hasWeights}
          />
          <Readout
            value={project.components.length > 0 ? formatCost(totals.totalCost, project.currency) : '–'}
            label={
              totals.spentCost < totals.totalCost
                ? `${formatCost(totals.spentCost, project.currency)} spent`
                : 'Total cost'
            }
            empty={project.components.length === 0}
          />
          <Readout value={`${coverage.filled}/${coverage.required.length}`} label="Core parts" grow={false} />
        </View>

        <View className="mt-4 gap-2">
          <PhaseProgress phases={checklist.phases} />
          <View className="flex-row items-center gap-2">
            {next?.critical ? <Icon name="alert-outline" size={16} color={palette.kapton} /> : null}
            <Text className="flex-1 text-sm text-muted" numberOfLines={1}>
              {next ? `Next: ${next.title}` : 'Checklist complete'}
            </Text>
            <Text className="text-sm text-dim" style={{ fontVariant: ['tabular-nums'] }}>
              {checklist.done}/{checklist.total}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export const ProjectCard = memo(ProjectCardBase);
