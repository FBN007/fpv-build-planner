import '../global.css';

import {
  BarlowSemiCondensed_500Medium,
  BarlowSemiCondensed_600SemiBold,
  BarlowSemiCondensed_700Bold,
  useFonts,
} from '@expo-google-fonts/barlow-semi-condensed';
import { router, Stack } from 'expo-router';
// Since SDK 56, navigation theming comes from expo-router, not @react-navigation/native.
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import palette from '@/theme/palette';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.carbon,
    card: palette.carbon,
    text: palette.ink,
    border: palette.line,
    primary: palette.kapton,
  },
};

function closeModal() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

function CancelButton() {
  return (
    <Pressable accessibilityRole="button" onPress={closeModal} hitSlop={12}>
      <Text className="text-base text-muted">Cancel</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowSemiCondensed_500Medium,
    BarlowSemiCondensed_600SemiBold,
    BarlowSemiCondensed_700Bold,
  });

  // Hold a blank carbon screen for the split second fonts take to load.
  // If loading fails, carry on with system fonts rather than block the app.
  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: palette.carbon }} />;
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.carbon },
            headerTintColor: palette.ink,
            headerTitleStyle: { fontFamily: 'BarlowSemiCondensed_700Bold', fontSize: 20 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: palette.carbon },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Hangar' }} />
          <Stack.Screen
            name="project/new"
            options={{ title: 'New build', presentation: 'modal', headerLeft: CancelButton }}
          />
          <Stack.Screen name="project/[id]/index" options={{ title: '' }} />
          <Stack.Screen
            name="project/[id]/part/[partId]"
            options={{ title: '', presentation: 'modal', headerLeft: CancelButton }}
          />
        </Stack>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
