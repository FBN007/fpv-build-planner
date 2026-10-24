import { Switch, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import type { SpecField } from '@/catalog/specs';
import type { SpecFormValue, SpecFormValues } from '@/logic/specForm';
import palette from '@/theme/palette';

interface Props {
  fields: SpecField[];
  values: SpecFormValues;
  errors: Record<string, string>;
  onChange: (key: string, value: SpecFormValue) => void;
}

/** Renders a category's spec fields. Consecutive number fields pair up two per row. */
export function SpecForm({ fields, values, errors, onChange }: Props) {
  const rows: SpecField[][] = [];
  for (const f of fields) {
    const last = rows[rows.length - 1];
    if (f.kind === 'number' && last && last.length === 1 && last[0].kind === 'number') last.push(f);
    else rows.push([f]);
  }

  return (
    <View className="gap-5">
      {rows.map((row) =>
        row.length === 2 ? (
          <View key={row[0].key} className="flex-row gap-3">
            {row.map((f) => (
              <View key={f.key} className="flex-1">
                <SpecInput field={f} value={values[f.key]} error={errors[f.key]} onChange={onChange} />
              </View>
            ))}
          </View>
        ) : (
          <SpecInput
            key={row[0].key}
            field={row[0]}
            value={values[row[0].key]}
            error={errors[row[0].key]}
            onChange={onChange}
          />
        ),
      )}
    </View>
  );
}

function SpecInput({
  field,
  value,
  error,
  onChange,
}: {
  field: SpecField;
  value: SpecFormValue | undefined;
  error?: string;
  onChange: (key: string, value: SpecFormValue) => void;
}) {
  switch (field.kind) {
    case 'number':
      return (
        <Field
          label={field.label}
          suffix={field.unit}
          value={typeof value === 'string' ? value : ''}
          onChangeText={(t) => onChange(field.key, t)}
          placeholder={field.placeholder ?? '–'}
          keyboardType="decimal-pad"
          error={error}
        />
      );
    case 'text':
      return (
        <Field
          label={field.label}
          value={typeof value === 'string' ? value : ''}
          onChangeText={(t) => onChange(field.key, t)}
          placeholder={field.placeholder}
          autoCapitalize="characters"
          error={error}
        />
      );
    case 'select': {
      const current = typeof value === 'string' ? value : '';
      return (
        <View className="gap-2">
          <Text className="text-sm text-muted">{field.label}</Text>
          <View className="flex-row flex-wrap gap-2">
            {field.options.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                selected={current === o.value}
                // Tapping the selected chip again clears it.
                onPress={() => onChange(field.key, current === o.value ? '' : o.value)}
              />
            ))}
          </View>
        </View>
      );
    }
    case 'multiselect': {
      const current = Array.isArray(value) ? value : [];
      return (
        <View className="gap-2">
          <Text className="text-sm text-muted">{field.label}</Text>
          <View className="flex-row flex-wrap gap-2">
            {field.options.map((o) => {
              const on = current.includes(o.value);
              return (
                <Chip
                  key={o.value}
                  label={o.label}
                  selected={on}
                  onPress={() => onChange(field.key, on ? current.filter((v) => v !== o.value) : [...current, o.value])}
                />
              );
            })}
          </View>
          {field.hint ? <Text className="text-xs leading-5 text-dim">{field.hint}</Text> : null}
        </View>
      );
    }
    case 'boolean':
      return (
        <View className="min-h-[48px] flex-row items-center justify-between rounded-xl border border-line bg-raised px-4">
          <Text className="text-base text-ink">{field.label}</Text>
          <Switch
            accessibilityLabel={field.label}
            value={value === true}
            onValueChange={(v) => onChange(field.key, v)}
            trackColor={{ false: palette.line, true: palette.kapton }}
            thumbColor={palette.ink}
          />
        </View>
      );
  }
}
