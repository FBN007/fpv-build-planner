import { Text, View } from 'react-native';

import { cn } from '@/utils/cn';

interface Props {
  value: string;
  unit?: string;
  label: string;
  /** Dim the value when it's a placeholder like "–". */
  empty?: boolean;
  /** Share the row's free width (default) or size to content. */
  grow?: boolean;
}

/** Instrument-style number: condensed figures with a plain-language label underneath. */
export function Readout({ value, unit, label, empty, grow = true }: Props) {
  return (
    <View className={grow ? 'flex-1' : undefined}>
      <View className="flex-row items-baseline">
        <Text
          className={cn('font-display text-2xl', empty ? 'text-dim' : 'text-ink')}
          style={{ fontVariant: ['tabular-nums'] }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
        {unit ? <Text className="ml-1 font-display-medium text-base text-muted">{unit}</Text> : null}
      </View>
      <Text className="text-xs text-muted" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
