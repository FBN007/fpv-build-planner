import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyHangar } from '@/components/dashboard/EmptyHangar';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { Project, VehicleType } from '@/models/types';
import { useProjectStore } from '@/store/projectStore';
import { useHydrated } from '@/store/useHydrated';

type Filter = 'all' | VehicleType;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const hydrated = useHydrated();
  const projects = useProjectStore((s) => s.projects);
  const duplicateProject = useProjectStore((s) => s.duplicateProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const [filter, setFilter] = useState<Filter>('all');

  // Select the record, then derive. Selecting a fresh array straight from the
  // store would re-render forever in Zustand v5.
  const sorted = useMemo(
    () => Object.values(projects).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [projects],
  );

  const counts = useMemo(() => {
    let quad = 0;
    let wing = 0;
    let flying = 0;
    for (const p of sorted) {
      if (p.vehicleType === 'quad') quad += 1;
      else wing += 1;
      if (p.status === 'flying') flying += 1;
    }
    return { quad, wing, flying };
  }, [sorted]);

  const showFilter = counts.quad > 0 && counts.wing > 0;
  const activeFilter: Filter = showFilter ? filter : 'all';
  const visible = activeFilter === 'all' ? sorted : sorted.filter((p) => p.vehicleType === activeFilter);

  const openProject = useCallback((p: Project) => router.push(`/project/${p.id}`), []);

  const confirmDelete = useCallback(
    (p: Project) =>
      Alert.alert(
        `Delete ${p.name}?`,
        'Its parts list and checklist progress will be removed from this phone. This can’t be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete build', style: 'destructive', onPress: () => deleteProject(p.id) },
        ],
      ),
    [deleteProject],
  );

  const openActions = useCallback(
    (p: Project) =>
      Alert.alert(p.name, undefined, [
        { text: 'Duplicate', onPress: () => duplicateProject(p.id) },
        { text: 'Delete…', style: 'destructive', onPress: () => confirmDelete(p) },
        { text: 'Cancel', style: 'cancel' },
      ]),
    [duplicateProject, confirmDelete],
  );

  const newBuild = (type?: VehicleType) =>
    router.push(type ? { pathname: '/project/new', params: { type } } : '/project/new');

  if (!hydrated) return <View className="flex-1 bg-carbon" />;

  if (sorted.length === 0) {
    return (
      <View className="flex-1 bg-carbon" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <EmptyHangar onCreate={newBuild} />
      </View>
    );
  }

  const summary = `${sorted.length} ${sorted.length === 1 ? 'build' : 'builds'}${
    counts.flying > 0 ? `, ${counts.flying} flying` : ''
  }`;

  return (
    <View className="flex-1 bg-carbon">
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ProjectCard project={item} onPress={openProject} onLongPress={openActions} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 104, paddingHorizontal: 16 }}
        ListHeaderComponent={
          <View className="mb-5 px-1">
            <Text className="font-display-bold text-4xl text-ink">Hangar</Text>
            <Text className="mt-0.5 text-base text-muted">{summary}</Text>
            {showFilter ? (
              <View className="mt-4 flex-row gap-2">
                <Chip label="All" count={sorted.length} selected={activeFilter === 'all'} onPress={() => setFilter('all')} />
                <Chip label="Quads" count={counts.quad} selected={activeFilter === 'quad'} onPress={() => setFilter('quad')} />
                <Chip
                  label="Fixed-wings"
                  count={counts.wing}
                  selected={activeFilter === 'fixed_wing'}
                  onPress={() => setFilter('fixed_wing')}
                />
              </View>
            ) : null}
          </View>
        }
      />
      <View className="absolute right-4" style={{ bottom: insets.bottom + 16 }}>
        <Button label="New build" icon="plus" onPress={() => newBuild()} />
      </View>
    </View>
  );
}

function Separator() {
  return <View className="h-3" />;
}
