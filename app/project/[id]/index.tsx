import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { BuildSummary } from '@/components/workspace/BuildSummary';
import { CategorySection } from '@/components/workspace/CategorySection';
import { categoriesFor, categoryLabel } from '@/catalog/categories';
import { STATUS_LABEL } from '@/catalog/labels';
import { useBuildStats } from '@/hooks/useBuildStats';
import { coveredCategories } from '@/logic/coverage';
import { describeProject } from '@/logic/factory';
import type { BuildComponent, ComponentCategory, ProjectStatus } from '@/models/types';
import { useProjectStore } from '@/store/projectStore';
import { useHydrated } from '@/store/useHydrated';

const STATUSES: ProjectStatus[] = ['planning', 'building', 'setup', 'flying'];

export default function WorkspaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const hydrated = useHydrated();
  const project = useProjectStore((s) => (id ? s.projects[id] : undefined));
  const updateProject = useProjectStore((s) => s.updateProject);
  const stats = useBuildStats(project);

  const byCategory = useMemo(() => {
    const map = new Map<ComponentCategory, BuildComponent[]>();
    for (const c of project?.components ?? []) {
      const list = map.get(c.category);
      if (list) list.push(c);
      else map.set(c.category, [c]);
    }
    return map;
  }, [project?.components]);

  // Categories covered by an all-in-one FC (ESC/receiver/VTX on the board).
  const fcCovered = useMemo(() => {
    if (!project) return new Set<ComponentCategory>();
    const covered = coveredCategories(project);
    const own = new Set(project.components.map((c) => c.category));
    return new Set([...covered].filter((c) => !own.has(c)));
  }, [project]);

  const addPart = useCallback(
    (category: ComponentCategory) =>
      router.push({ pathname: '/project/[id]/part/[partId]', params: { id: id ?? '', partId: 'new', category } }),
    [id],
  );

  const editPart = useCallback(
    (part: BuildComponent) =>
      router.push({ pathname: '/project/[id]/part/[partId]', params: { id: id ?? '', partId: part.id } }),
    [id],
  );

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

  const required = new Set(stats.coverage.required);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 24 }}>
      <Stack.Screen options={{ title: project.name }} />

      <View className="gap-3">
        <Text className="px-1 text-base text-muted">{describeProject(project)}</Text>
        <BuildSummary project={project} stats={stats} />
        <View className="flex-row flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              label={STATUS_LABEL[s]}
              selected={project.status === s}
              onPress={() => updateProject(project.id, { status: s })}
            />
          ))}
        </View>
      </View>

      {categoriesFor(project.vehicleType).map((meta) => (
        <CategorySection
          key={meta.id}
          meta={meta}
          label={categoryLabel(meta.id, project.vehicleType)}
          parts={byCategory.get(meta.id) ?? []}
          vehicle={project.vehicleType}
          currency={project.currency}
          required={required.has(meta.id)}
          coveredByFc={fcCovered.has(meta.id)}
          onAdd={addPart}
          onEdit={editPart}
        />
      ))}
    </ScrollView>
  );
}
