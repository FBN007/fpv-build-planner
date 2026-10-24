import { Pressable, Text } from 'react-native';

import { cn } from '@/utils/cn';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Optional trailing count, e.g. the number of builds behind a filter. */
  count?: number;
}

export function Chip({ label, selected, onPress, count }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'flex-row items-center rounded-full border px-4 py-2 active:opacity-80',
        selected ? 'border-kapton bg-kapton-deep' : 'border-line bg-raised',
      )}
    >
      <Text className={cn('text-sm', selected ? 'font-semibold text-kapton' : 'text-muted')}>{label}</Text>
      {count !== undefined ? (
        <Text className={cn('ml-1.5 text-sm', selected ? 'text-kapton' : 'text-dim')}>{count}</Text>
      ) : null}
    </Pressable>
  );
}
