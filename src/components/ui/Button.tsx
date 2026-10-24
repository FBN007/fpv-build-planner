import { Pressable, Text, View, type PressableProps } from 'react-native';

import palette from '@/theme/palette';
import { cn } from '@/utils/cn';

import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  icon?: IconName;
  variant?: Variant;
  /** Stretch to the parent's width. */
  block?: boolean;
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-kapton',
  secondary: 'border border-line bg-raised',
  ghost: '',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-carbon',
  secondary: 'text-ink',
  ghost: 'text-muted',
};

const ICON_COLOR: Record<Variant, string> = {
  primary: palette.carbon,
  secondary: palette.ink,
  ghost: palette.muted,
};

export function Button({ label, icon, variant = 'primary', block, disabled, className, ...props }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(
        'min-h-[48px] flex-row items-center justify-center rounded-xl px-5 active:opacity-80',
        CONTAINER[variant],
        block && 'self-stretch',
        disabled && 'opacity-40',
        className,
      )}
      {...props}
    >
      <View className="flex-row items-center gap-2">
        {icon ? <Icon name={icon} size={20} color={ICON_COLOR[variant]} /> : null}
        <Text className={cn('font-display-bold text-lg', LABEL[variant])}>{label}</Text>
      </View>
    </Pressable>
  );
}
