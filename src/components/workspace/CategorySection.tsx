import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { CategoryMeta } from '@/catalog/categories';
import type { BuildComponent, ComponentCategory, VehicleType } from '@/models/types';
import palette from '@/theme/palette';

import { PartCard } from './PartCard';

interface Props {
  meta: CategoryMeta;
  label: string;
  parts: BuildComponent[];
  vehicle: VehicleType;
  currency: string;
  required: boolean;
  /** Covered by an all-in-one flight controller rather than its own part. */
  coveredByFc: boolean;
  onAdd: (category: ComponentCategory) => void;
  onEdit: (part: BuildComponent) => void;
}

export function CategorySection({
  meta,
  label,
  parts,
  vehicle,
  currency,
  required,
  coveredByFc,
  onAdd,
  onEdit,
}: Props) {
  const missing = required && parts.length === 0 && !coveredByFc;

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 px-1">
        <Icon name={meta.icon} size={18} color={missing ? palette.kapton : palette.muted} />
        <Text className="flex-1 font-display text-lg text-ink">{label}</Text>
        {missing ? <Badge label="Needed" tone="accent" /> : null}
      </View>

      {parts.map((p) => (
        <PartCard key={p.id} part={p} vehicle={vehicle} currency={currency} onPress={onEdit} />
      ))}

      {coveredByFc && parts.length === 0 ? (
        <Text className="px-1 text-sm text-dim">Built into the flight controller.</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => onAdd(meta.id)}
        className="min-h-[44px] flex-row items-center gap-2 rounded-xl border border-dashed border-line px-4 active:opacity-70"
      >
        <Icon name="plus" size={18} color={palette.muted} />
        <Text className="text-sm text-muted">{parts.length === 0 ? `Add ${label.toLowerCase()}` : 'Add another'}</Text>
      </Pressable>
    </View>
  );
}
