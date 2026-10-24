import { Text, View } from 'react-native';

import { cn } from '@/utils/cn';

export type BadgeTone = 'neutral' | 'accent' | 'ok';

const CONTAINER: Record<BadgeTone, string> = {
  neutral: 'border-line bg-raised',
  accent: 'border-kapton/40 bg-kapton-deep',
  ok: 'border-mask/40 bg-mask-deep',
};

const LABEL: Record<BadgeTone, string> = {
  neutral: 'text-muted',
  accent: 'text-kapton',
  ok: 'text-mask',
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <View className={cn('rounded-full border px-2.5 py-1', CONTAINER[tone])}>
      <Text className={cn('text-xs font-semibold', LABEL[tone])}>{label}</Text>
    </View>
  );
}
