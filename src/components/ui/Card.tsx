import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

/** Flat surface with a 1px border. No shadows: depth comes from the carbon/weave contrast. */
export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={cn('rounded-2xl border border-line bg-weave', className)} {...props} />;
}
