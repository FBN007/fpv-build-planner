import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { VehicleGlyph } from '@/components/ui/VehicleGlyph';
import type { VehicleType } from '@/models/types';

export function EmptyHangar({ onCreate }: { onCreate: (type: VehicleType) => void }) {
  return (
    <View className="flex-1 justify-center px-6 pb-16">
      <View className="mb-6 flex-row gap-3">
        <VehicleGlyph type="quad" size="lg" />
        <VehicleGlyph type="fixed_wing" size="lg" />
      </View>
      <Text className="font-display-bold text-3xl text-ink">Your hangar is empty</Text>
      <Text className="mt-2 text-base leading-6 text-muted">
        Start a build to plan its parts, keep an eye on weight and cost, and work through wiring and setup step by step.
      </Text>
      <View className="mt-8 gap-3">
        <Button label="Plan a quad" icon="quadcopter" onPress={() => onCreate('quad')} />
        <Button label="Plan a fixed-wing" icon="airplane" variant="secondary" onPress={() => onCreate('fixed_wing')} />
      </View>
    </View>
  );
}
