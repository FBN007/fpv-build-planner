import { Text, TextInput, View, type TextInputProps } from 'react-native';

import palette from '@/theme/palette';

interface Props extends Omit<TextInputProps, 'style' | 'className'> {
  label: string;
  /** Unit shown inside the input, e.g. "mm". */
  suffix?: string;
  hint?: string;
}

export function Field({ label, suffix, hint, ...inputProps }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-muted">{label}</Text>
      <View className="flex-row items-center rounded-xl border border-line bg-raised px-4">
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={palette.dim}
          selectionColor={palette.kapton}
          cursorColor={palette.kapton}
          className="min-h-[48px] flex-1 py-3 text-base text-ink"
          {...inputProps}
        />
        {suffix ? <Text className="ml-2 text-base text-dim">{suffix}</Text> : null}
      </View>
      {hint ? <Text className="text-xs leading-5 text-dim">{hint}</Text> : null}
    </View>
  );
}
