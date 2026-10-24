import { Pressable, Text, View } from 'react-native';

import palette from '@/theme/palette';
import { cn } from '@/utils/cn';

import { Icon, type IconName } from './Icon';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ label, value, onChange, min = 0, max = 99 }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-muted">{label}</Text>
      <View className="flex-row items-center self-start rounded-xl border border-line bg-raised">
        <StepButton icon="minus" label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onPress={() => onChange(value - 1)} />
        <Text className="w-12 text-center font-display text-xl text-ink" accessibilityLiveRegion="polite">
          {value}
        </Text>
        <StepButton icon="plus" label={`More ${label.toLowerCase()}`} disabled={value >= max} onPress={() => onChange(value + 1)} />
      </View>
    </View>
  );
}

function StepButton({ icon, label, disabled, onPress }: { icon: IconName; label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn('h-[48px] w-[48px] items-center justify-center active:opacity-60', disabled && 'opacity-30')}
    >
      <Icon name={icon} size={20} color={palette.ink} />
    </Pressable>
  );
}
