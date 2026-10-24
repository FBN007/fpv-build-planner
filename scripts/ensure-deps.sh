#!/usr/bin/env bash
# Installs any required package that's missing from package.json, using
# `expo install` so versions match the Expo SDK. Prints "changed=true" to
# $GITHUB_OUTPUT when package.json was updated.
set -euo pipefail

RUNTIME=(expo-router expo-linking expo-constants expo-status-bar expo-system-ui
  react-native-safe-area-context react-native-screens
  @react-native-async-storage/async-storage
  expo-font @expo-google-fonts/barlow-semi-condensed @expo/vector-icons
  nativewind react-native-reanimated react-native-worklets zustand babel-preset-expo react-native-keyboard-controller)

missing=()
for pkg in "${RUNTIME[@]}"; do
  has=$(node -e "const p=require('./package.json');process.stdout.write(String(!!((p.dependencies||{})[process.argv[1]]||(p.devDependencies||{})[process.argv[1]])))" "$pkg")
  [ "$has" = "true" ] || missing+=("$pkg")
done
has_tw=$(node -e "const p=require('./package.json');process.stdout.write(String(!!((p.devDependencies||{}).tailwindcss||(p.dependencies||{}).tailwindcss)))")

changed=false
if [ ${#missing[@]} -gt 0 ]; then
  echo "Installing missing packages: ${missing[*]}"
  npx expo install "${missing[@]}"
  changed=true
fi
if [ "$has_tw" != "true" ]; then
  npm install --save-dev tailwindcss@^3.4.17
  changed=true
fi
echo "changed=$changed" >> "${GITHUB_OUTPUT:-/dev/null}"
