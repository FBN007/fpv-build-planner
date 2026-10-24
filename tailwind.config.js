/** @type {import('tailwindcss').Config} */
const palette = require('./src/theme/palette');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        carbon: palette.carbon,
        weave: palette.weave,
        raised: palette.raised,
        line: palette.line,
        ink: palette.ink,
        muted: palette.muted,
        dim: palette.dim,
        kapton: { DEFAULT: palette.kapton, deep: palette.kaptonDeep },
        mask: { DEFAULT: palette.mask, deep: palette.maskDeep },
        signal: { DEFAULT: palette.signal, deep: palette.signalDeep },
      },
      // Custom fonts in React Native need one family name per weight.
      fontFamily: {
        display: ['BarlowSemiCondensed_600SemiBold'],
        'display-bold': ['BarlowSemiCondensed_700Bold'],
        'display-medium': ['BarlowSemiCondensed_500Medium'],
      },
    },
  },
  plugins: [],
};
