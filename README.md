# FPV Build Planner

Plan, calculate and track FPV quad and fixed-wing builds. Expo + Expo Router + NativeWind v4 + Zustand.

## Setup

These files sit on top of a fresh Expo project, so `npx expo install` picks package versions that match your Expo SDK.

```bash
# 1. Fresh Expo project (TypeScript, blank)
npx create-expo-app@latest fpv-build-planner --template blank-typescript
cd fpv-build-planner

# 2. Navigation, storage, fonts, icons
npx expo install expo-router expo-linking expo-constants expo-status-bar expo-system-ui \
  react-native-safe-area-context react-native-screens \
  @react-native-async-storage/async-storage \
  expo-font @expo-google-fonts/barlow-semi-condensed @expo/vector-icons

# 3. Styling (NativeWind v4 is the stable line; v5 is still a release candidate)
npx expo install nativewind@^4.2.7 react-native-reanimated react-native-worklets
npm install --save-dev tailwindcss@^3.4.17

# 4. State
npx expo install zustand
```

Then:

1. Copy everything from this folder into the project, overwriting `app.json`, `babel.config.js` and `tsconfig.json`. (If you want to keep the template's icon and splash settings, merge `app.json` by hand instead.)
2. Delete the template's `App.tsx` and `index.ts`.
3. In `package.json`, set `"main": "expo-router/entry"`.
4. Start with a clean cache the first time: `npx expo start -c`

## Android APK via GitHub (no Android Studio needed)

Every push to `main` builds an APK in GitHub Actions (`.github/workflows/android-apk.yml`) and publishes it under **Releases**. On your phone, open the repo's Releases page, tap the newest `.apk` and install it. The first run also creates `package.json` and commits it back to the repo.

The APK is signed with the standard React Native debug key, so new builds install over old ones and keep your data. That's fine for personal use; publishing on Google Play needs a proper signing key.

## Run on an Android phone

**Quick test with Expo Go (no build needed)**

1. Install **Expo Go** from Google Play.
2. On your computer, in the project folder: `npx expo start`
3. Scan the QR code with Expo Go. The phone and computer must be on the same Wi-Fi (otherwise use `npx expo start --tunnel`).

**Installable APK (runs without your computer)**

1. Create a free account at expo.dev, then on your computer:
   ```bash
   npm install -g eas-cli
   eas login
   eas build -p android --profile preview
   ```
2. The build runs in Expo's cloud (about 10–20 min). When it's done, open the link it prints on your phone, download the `.apk` and install it. Android will ask you to allow installs from that source.

Change `android.package` in `app.json` to your own ID (e.g. `com.yourname.fpvbuild`) before the first build; it can't be changed later for the same app. The `production` profile in `eas.json` makes a Play Store bundle (`.aab`) if you ever publish it.

## Structure

```
app/                       Expo Router screens (file = route)
  _layout.tsx              Root stack, fonts, dark theme
  index.tsx                Project Dashboard ("Hangar")
  project/new.tsx          New build form
  project/[id]/index.tsx   Placeholder until the Component Workspace step
src/
  models/types.ts          Project, BuildComponent, checklist types
  catalog/                 Category metadata + checklist templates
  logic/                   Pure functions: totals, coverage, checklist progress
  store/                   Zustand store persisted to AsyncStorage
  hooks/                   useBuildStats
  components/ui/           Card, Button, Chip, Field, Stepper, PhaseProgress…
  components/dashboard/    ProjectCard, EmptyHangar
  theme/palette.js         Colours shared by Tailwind and TS
```

## Design rules

- Only raw input is stored. Cost, weight, coverage and checklist progress are recomputed from components every render, so they never go stale.
- Checklist templates live in code. Projects store progress by item ID, so template updates never break saved builds.
- `schemaVersion` + the store's `migrate` hook handle future data changes.
