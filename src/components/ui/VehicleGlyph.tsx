import { View } from 'react-native';

import type { VehicleType } from '@/models/types';
import palette from '@/theme/palette';
import { cn } from '@/utils/cn';

import { Icon } from './Icon';

interface Props {
  type: VehicleType;
  size?: 'md' | 'lg';
  /** Highlight in the accent colour, e.g. when selected. */
  active?: boolean;
}

export function VehicleGlyph({ type, size = 'md', active }: Props) {
  const box = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl';
  const iconSize = size === 'lg' ? 30 : 24;
  return (
    <View className={cn('items-center justify-center border', box, active ? 'border-kapton bg-kapton-deep' : 'border-line bg-raised')}>
      <Icon name={type === 'quad' ? 'quadcopter' : 'airplane'} size={iconSize} color={active ? palette.kapton : palette.ink} />
    </View>
  );
}
