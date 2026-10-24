#!/usr/bin/env bash
# Turns this repo into a complete Expo project: creates package.json from the
# official blank TypeScript template and installs the dependencies listed in
# README.md. Safe to run once; does nothing if package.json already exists.
set -euo pipefail

if [ -f package.json ]; then
  echo "package.json already exists, nothing to bootstrap."
  exit 0
fi

TMP="$(mktemp -d)"
echo "Creating Expo template in $TMP"
(cd "$TMP" && CI=1 npx --yes create-expo-app@latest app --template blank-typescript)

cp "$TMP/app/package.json" .
[ -f "$TMP/app/package-lock.json" ] && cp "$TMP/app/package-lock.json" .
[ -d assets ] || cp -R "$TMP/app/assets" ./assets

npm pkg set main=expo-router/entry
npm install

npx expo install expo-router expo-linking expo-constants expo-status-bar expo-system-ui \
  react-native-safe-area-context react-native-screens \
  @react-native-async-storage/async-storage \
  expo-font @expo-google-fonts/barlow-semi-condensed @expo/vector-icons \
  nativewind@^4.2.7 react-native-reanimated react-native-worklets zustand
npm install --save-dev tailwindcss@^3.4.17

rm -rf "$TMP"
echo "Bootstrap done."
