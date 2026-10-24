import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Stepper } from '@/components/ui/Stepper';
import { VehicleGlyph } from '@/components/ui/VehicleGlyph';
import {
  CURRENCIES,
  DEFAULT_FIRMWARE,
  DEFAULT_SERVOS,
  FIRMWARE_LABEL,
  LAYOUT_LABEL,
  PROP_SIZES_IN,
} from '@/catalog/labels';
import type { NewProjectInput } from '@/logic/factory';
import type { Firmware, VehicleType, WingLayout } from '@/models/types';
import { useProjectStore } from '@/store/projectStore';
import palette from '@/theme/palette';
import { cn } from '@/utils/cn';
import { parseNumber } from '@/utils/format';

const FIRMWARES: Firmware[] = ['betaflight', 'inav', 'ardupilot'];
const LAYOUTS: WingLayout[] = ['flying_wing', 'conventional', 'v_tail'];

const VEHICLES: { type: VehicleType; title: string; body: string }[] = [
  { type: 'quad', title: 'Quad', body: 'Freestyle, racing, cinewhoop or long range' },
  { type: 'fixed_wing', title: 'Fixed-wing', body: 'Flying wings and planes, foam or balsa' },
];

export default function NewProjectScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ type?: string }>();
  const initialType: VehicleType = params.type === 'fixed_wing' ? 'fixed_wing' : 'quad';
  const createProject = useProjectStore((s) => s.createProject);

  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialType);
  const [firmware, setFirmware] = useState<Firmware>(DEFAULT_FIRMWARE[initialType]);
  const [firmwareTouched, setFirmwareTouched] = useState(false);
  const [currency, setCurrency] = useState('DKK');

  // Quad
  const [propSizeIn, setPropSizeIn] = useState(5);

  // Fixed-wing
  const [layout, setLayout] = useState<WingLayout>('flying_wing');
  const [wingspan, setWingspan] = useState('');
  const [wingArea, setWingArea] = useState('');
  const [servoCount, setServoCount] = useState(DEFAULT_SERVOS.flying_wing);
  const [servosTouched, setServosTouched] = useState(false);

  const wingspanValue = parseNumber(wingspan);
  const wingAreaValue = parseNumber(wingArea);
  const wingspanInvalid = wingspan.trim() !== '' && (wingspanValue === null || wingspanValue <= 0);
  const wingAreaInvalid = wingArea.trim() !== '' && (wingAreaValue === null || wingAreaValue <= 0);
  const canCreate = vehicleType === 'quad' || (!wingspanInvalid && !wingAreaInvalid);

  const chooseVehicle = (type: VehicleType) => {
    setVehicleType(type);
    if (!firmwareTouched) setFirmware(DEFAULT_FIRMWARE[type]);
  };

  const chooseLayout = (next: WingLayout) => {
    setLayout(next);
    if (!servosTouched) setServoCount(DEFAULT_SERVOS[next]);
  };

  const submit = () => {
    if (!canCreate) return;
    const common = { name, firmware, currency };
    const input: NewProjectInput =
      vehicleType === 'quad'
        ? { ...common, vehicleType: 'quad', airframe: { propSizeIn, motorCount: 4 } }
        : {
            ...common,
            vehicleType: 'fixed_wing',
            airframe: {
              layout,
              wingspanMm: wingspanValue ?? 0,
              wingAreaDm2: wingAreaValue,
              servoCount,
            },
          };
    const id = createProject(input);
    router.replace(`/project/${id}`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.carbon }}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 28 }}
    >
      <Section title="What are you building?">
        <View className="flex-row gap-3">
          {VEHICLES.map((v) => {
            const selected = vehicleType === v.type;
            return (
              <Pressable
                key={v.type}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => chooseVehicle(v.type)}
                className={cn(
                  'flex-1 gap-3 rounded-2xl border p-4 active:opacity-80',
                  selected ? 'border-kapton bg-kapton-deep' : 'border-line bg-weave',
                )}
              >
                <VehicleGlyph type={v.type} active={selected} />
                <View>
                  <Text className={cn('font-display-bold text-xl', selected ? 'text-kapton' : 'text-ink')}>
                    {v.title}
                  </Text>
                  <Text className="mt-0.5 text-sm leading-5 text-muted">{v.body}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Field
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder={vehicleType === 'quad' ? `${propSizeIn}" quad` : `${LAYOUT_LABEL[layout]} build`}
        returnKeyType="done"
        maxLength={60}
      />

      {vehicleType === 'quad' ? (
        <Section title="Prop size">
          <View className="flex-row flex-wrap gap-2">
            {PROP_SIZES_IN.map((size) => (
              <Chip key={size} label={`${size}"`} selected={propSizeIn === size} onPress={() => setPropSizeIn(size)} />
            ))}
          </View>
        </Section>
      ) : (
        <>
          <Section title="Layout">
            <View className="flex-row flex-wrap gap-2">
              {LAYOUTS.map((l) => (
                <Chip key={l} label={LAYOUT_LABEL[l]} selected={layout === l} onPress={() => chooseLayout(l)} />
              ))}
            </View>
          </Section>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Field
                label="Wingspan"
                suffix="mm"
                value={wingspan}
                onChangeText={setWingspan}
                placeholder="800"
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <Field
                label="Wing area"
                suffix="dm²"
                value={wingArea}
                onChangeText={setWingArea}
                placeholder="Optional"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          {wingspanInvalid || wingAreaInvalid ? (
            <Text className="-mt-4 text-sm text-signal">Enter wingspan and wing area as positive numbers.</Text>
          ) : (
            <Text className="-mt-4 text-xs leading-5 text-dim">
              Wing area comes from the kit’s spec sheet and lets the app work out wing loading.
            </Text>
          )}
          <Stepper
            label="Servos"
            value={servoCount}
            min={0}
            max={12}
            onChange={(n) => {
              setServoCount(n);
              setServosTouched(true);
            }}
          />
        </>
      )}

      <Section title="Firmware">
        <View className="flex-row flex-wrap gap-2">
          {FIRMWARES.map((f) => (
            <Chip
              key={f}
              label={FIRMWARE_LABEL[f]}
              selected={firmware === f}
              onPress={() => {
                setFirmware(f);
                setFirmwareTouched(true);
              }}
            />
          ))}
        </View>
      </Section>

      <Section title="Currency">
        <View className="flex-row flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <Chip key={c} label={c} selected={currency === c} onPress={() => setCurrency(c)} />
          ))}
        </View>
      </Section>

      <Button label="Create build" onPress={submit} disabled={!canCreate} block />
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-sm text-muted">{title}</Text>
      {children}
    </View>
  );
}
