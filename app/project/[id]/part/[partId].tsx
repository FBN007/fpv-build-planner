import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Stepper } from '@/components/ui/Stepper';
import { SpecForm } from '@/components/workspace/SpecForm';
import { CATEGORIES, categoriesFor, categoryLabel } from '@/catalog/categories';
import { COMPONENT_STATUS_LABEL } from '@/catalog/labels';
import { defaultQuantity, specFieldsFor } from '@/catalog/specs';
import { fromFormValues, toFormValues, type SpecFormValue } from '@/logic/specForm';
import type { BuildComponent, ComponentCategory, ComponentStatus, Project } from '@/models/types';
import { useProjectStore } from '@/store/projectStore';
import palette from '@/theme/palette';
import { formatWeight, parseNumber } from '@/utils/format';

const STATUSES: ComponentStatus[] = ['wishlist', 'ordered', 'owned', 'installed'];

function isCategory(value: string | undefined): value is ComponentCategory {
  return CATEGORIES.some((c) => c.id === value);
}

function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function PartEditorScreen() {
  const params = useLocalSearchParams<{ id: string; partId: string; category?: string }>();
  const project = useProjectStore((s) => (params.id ? s.projects[params.id] : undefined));
  const existing = project?.components.find((c) => c.id === params.partId);

  if (!project) {
    return (
      <View className="flex-1 justify-center bg-carbon px-6">
        <Text className="text-base text-muted">This build no longer exists.</Text>
      </View>
    );
  }
  if (params.partId !== 'new' && !existing) {
    return (
      <View className="flex-1 justify-center bg-carbon px-6">
        <Stack.Screen options={{ title: 'Part not found' }} />
        <Text className="text-base text-muted">This part was removed.</Text>
      </View>
    );
  }

  const initialCategory: ComponentCategory =
    existing?.category ?? (isCategory(params.category) ? params.category : 'other');
  // Key on the part so the form resets if the route is reused for another part.
  return (
    <PartForm key={existing?.id ?? 'new'} project={project} existing={existing} initialCategory={initialCategory} />
  );
}

function PartForm({
  project,
  existing,
  initialCategory,
}: {
  project: Project;
  existing: BuildComponent | undefined;
  initialCategory: ComponentCategory;
}) {
  const insets = useSafeAreaInsets();
  const addComponent = useProjectStore((s) => s.addComponent);
  const updateComponent = useProjectStore((s) => s.updateComponent);
  const removeComponent = useProjectStore((s) => s.removeComponent);

  const vehicle = project.vehicleType;
  const [category, setCategory] = useState<ComponentCategory>(initialCategory);
  const fields = useMemo(() => specFieldsFor(category, vehicle), [category, vehicle]);

  const [name, setName] = useState(existing?.name ?? '');
  const [quantity, setQuantity] = useState(existing?.quantity ?? defaultQuantity(initialCategory, project));
  const [weight, setWeight] = useState(existing && existing.unitWeightG > 0 ? String(existing.unitWeightG) : '');
  const [cost, setCost] = useState(existing && existing.lineCost > 0 ? String(existing.lineCost) : '');
  const [status, setStatus] = useState<ComponentStatus>(existing?.status ?? 'wishlist');
  const [specValues, setSpecValues] = useState(() => toFormValues(fields, existing?.specs ?? {}));
  const [link, setLink] = useState(existing?.link ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const label = categoryLabel(category, vehicle);
  const weightValue = parseNumber(weight);
  const totalWeight = weightValue !== null && weightValue > 0 ? weightValue * quantity : 0;

  const changeCategory = (next: ComponentCategory) => {
    setCategory(next);
    setQuantity(defaultQuantity(next, project));
    setSpecValues(toFormValues(specFieldsFor(next, vehicle), {}));
    setErrors({});
  };

  const setSpec = (key: string, value: SpecFormValue) => {
    setSpecValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _gone, ...rest }) => rest);
  };

  const save = () => {
    const next: Record<string, string> = {};
    const w = weight.trim() === '' ? 0 : parseNumber(weight);
    const c = cost.trim() === '' ? 0 : parseNumber(cost);
    if (w === null || w < 0) next.weight = 'Enter the weight of one part in grams';
    if (c === null || c < 0) next.cost = 'Enter a price, or leave it empty';
    const { specs, errors: specErrors } = fromFormValues(
      fields,
      specValues,
      existing?.category === category ? existing.specs : {},
    );
    Object.assign(next, specErrors);
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const data = {
      category,
      name: name.trim() || label,
      quantity,
      unitWeightG: w ?? 0,
      lineCost: c ?? 0,
      status,
      specs,
      link: link.trim(),
      notes: notes.trim(),
    };
    if (existing) updateComponent(project.id, existing.id, data);
    else addComponent(project.id, data);
    close();
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert(`Remove ${existing.name}?`, 'It will be taken off this build’s parts list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove part',
        style: 'destructive',
        onPress: () => {
          removeComponent(project.id, existing.id);
          close();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: existing ? `Edit ${label.toLowerCase()}` : `Add ${label.toLowerCase()}` }} />
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: palette.carbon }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 24 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        {!existing ? (
          <View className="gap-2">
            <Text className="text-sm text-muted">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categoriesFor(vehicle).map((c) => (
                <Chip
                  key={c.id}
                  label={categoryLabel(c.id, vehicle)}
                  selected={category === c.id}
                  onPress={() => changeCategory(c.id)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <Field label="Name" value={name} onChangeText={setName} placeholder={label} maxLength={80} />

        <View className="flex-row items-end gap-3">
          <Stepper label="Quantity" value={quantity} onChange={setQuantity} min={1} max={16} />
          <View className="flex-1">
            <Field
              label="Weight of one"
              suffix="g"
              value={weight}
              onChangeText={(t) => {
                setWeight(t);
                if (errors.weight) setErrors(({ weight: _w, ...rest }) => rest);
              }}
              placeholder="0"
              keyboardType="decimal-pad"
              error={errors.weight}
            />
          </View>
        </View>
        {quantity > 1 && totalWeight > 0 ? (
          <Text className="-mt-4 px-1 text-sm text-muted">
            {formatWeight(totalWeight)} for {quantity}
          </Text>
        ) : null}

        <Field
          label="Cost for this line"
          suffix={project.currency}
          value={cost}
          onChangeText={(t) => {
            setCost(t);
            if (errors.cost) setErrors(({ cost: _c, ...rest }) => rest);
          }}
          placeholder="0"
          keyboardType="decimal-pad"
          hint={quantity > 1 ? `What you paid for all ${quantity}, e.g. the whole pack.` : undefined}
          error={errors.cost}
        />

        <View className="gap-2">
          <Text className="text-sm text-muted">Status</Text>
          <View className="flex-row flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Chip key={s} label={COMPONENT_STATUS_LABEL[s]} selected={status === s} onPress={() => setStatus(s)} />
            ))}
          </View>
        </View>

        {fields.length > 0 ? (
          <View className="gap-4">
            <Text className="font-display text-xl text-ink">Specs</Text>
            <SpecForm fields={fields} values={specValues} errors={errors} onChange={setSpec} />
          </View>
        ) : null}

        <Field
          label="Link"
          value={link}
          onChangeText={setLink}
          placeholder="Shop or product page"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

        <View className="gap-3">
          <Button label={existing ? 'Save changes' : 'Add part'} onPress={save} block />
          {existing ? <Button label="Remove part" variant="ghost" onPress={confirmDelete} block /> : null}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
