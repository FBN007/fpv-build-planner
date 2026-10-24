// Single source of truth for colours. Used by tailwind.config.js (CommonJS)
// and by TS code that needs raw hex values (icons, headers, placeholders).
//
// The palette is taken from the FPV workbench: carbon-fibre greys for the
// surfaces, Kapton-tape amber as the one accent, solder-mask green for
// "done", and OSD white for text.
module.exports = {
  carbon: '#1A1D21', // app background
  weave: '#22262B', // cards
  raised: '#2B3036', // inputs, pressed states, empty progress
  line: '#363C44', // 1px borders
  ink: '#EDEFF2', // primary text (OSD white)
  muted: '#9AA1AB', // secondary text
  dim: '#6B727C', // tertiary text, placeholders
  kapton: '#E9A23B', // accent: primary action + progress
  kaptonDeep: '#3A2C17', // accent tint for selected backgrounds
  mask: '#3FB27F', // done / OK
  maskDeep: '#17321F',
  signal: '#E5484D', // destructive / errors
  signalDeep: '#3A1A1C',
};
