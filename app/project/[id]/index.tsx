// Placeholder so tapping a build card works. Replaced by the Component
// Workspace in the next step.
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Readout } from '@/components/ui/Readout';
import { useBuildStats } from '@/hooks/useBuildStats';
import { describeProject } from '@/logic/factory';
import { useProjectStore } from '@/store/projectStore';
import { useHydrated } from '@/store/useHydrated';
import { formatCost, weightParts } from '@/utils/format';

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hydrated = useHydrated();
  const project = useProjectStore((s) => (id ? s.projects[id] : undefined));
  const stats = useBuildStats(project);

  if (!hydrated) return <View className="flex-1 bg-carbon" />;

  if (!project || !stats) {
    return (
      <View className="flex-1 justify-center bg-carbon px-6">
        <Stack.Screen options={{ title: 'Build not found' }} />
        <Text className="font-display-bold text-2xl text-ink">This build isn’t in your hangar</Text>
        <Text className="mt-2 text-base text-muted">It may have been deleted.</Text>
        <Button className="mt-6" label="Back to hangar" variant="secondary" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const weight = weightParts(stats.totals.auwG);

  return (
    <View className="flex-1 gap-4 bg-carbon p-4">
      <Stack.Screen options={{ title: project.name }} />
      <Text className="text-base text-muted">{describeProject(project)}</Text>
      <Card className="flex-row gap-3 p-4">
        <Readout value={weight.value} unit={weight.unit} label="All-up weight" empty={!stats.totals.hasWeights} />
        <Readout value={formatCost(stats.totals.totalCost, project.currency)} label="Total cost" />
        <Readout value={`${stats.coverage.filled}/${stats.coverage.required.length}`} label="Core parts" grow={false} />
      </Card>
      <Text className="text-sm leading-5 text-dim">The parts workspace for this build is the next screen we build.</Text>
    </View>
  );
}
