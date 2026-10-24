import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { COMPONENT_STATUS_LABEL } from '@/catalog/labels';
import { summarizeSpecs } from '@/catalog/specs';
import { lineWeight } from '@/logic/totals';
import type { BuildComponent, ComponentStatus, VehicleType } from '@/models/types';
import { formatCost, formatWeight } from '@/utils/format';

const STATUS_TONE: Record<ComponentStatus, BadgeTone> = {
  wishlist: 'neutral',
  ordered: 'accent',
  owned: 'ok',
  installed: 'ok',
};

interface Props {
  part: BuildComponent;
  vehicle: VehicleType;
  currency: string;
  onPress: (part: BuildComponent) => void;
}

function PartCardBase({ part, vehicle, currency, onPress }: Props) {
  const specs = summarizeSpecs(part.category, vehicle, part.specs);
  const weight = lineWeight(part);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Edit this part"
      onPress={() => onPress(part)}
      className="rounded-xl border border-line bg-weave px-4 py-3 active:opacity-80"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text className="font-display text-lg text-ink" numberOfLines={1}>
            {part.name}
            {part.quantity > 1 ? <Text className="font-display-medium text-muted">{`  ×${part.quantity}`}</Text> : null}
          </Text>
          {specs ? (
            <Text className="text-sm text-muted" numberOfLines={2}>
              {specs}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="font-display text-lg text-ink" style={{ fontVariant: ['tabular-nums'] }}>
            {weight > 0 ? formatWeight(weight) : '– g'}
          </Text>
          <Text className="text-sm text-muted" style={{ fontVariant: ['tabular-nums'] }}>
            {part.lineCost > 0 ? formatCost(part.lineCost, currency) : 'No price'}
          </Text>
        </View>
      </View>
      <View className="mt-2 flex-row">
        <Badge label={COMPONENT_STATUS_LABEL[part.status]} tone={STATUS_TONE[part.status]} />
      </View>
    </Pressable>
  );
}

export const PartCard = memo(PartCardBase);
