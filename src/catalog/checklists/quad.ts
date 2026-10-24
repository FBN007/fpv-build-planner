import type { ChecklistTemplate } from '../../models/types';

export const quadChecklist: ChecklistTemplate = {
  id: 'quad',
  version: 1,
  vehicleType: 'quad',
  phases: [
    {
      id: 'prep',
      title: 'Bench prep',
      items: [
        {
          id: 'q-inventory',
          title: 'Lay out every part and check it against the plan',
          detail:
            'Count motor screws, grommets, standoffs and pigtails before you start. Missing a 3 mm screw stops a build cold.',
        },
        {
          id: 'q-flash-fc',
          title: 'Flash the flight controller firmware',
          detail: 'Use the exact board target. It is far easier now than once the FC is buried in the stack.',
        },
        {
          id: 'q-short-check',
          title: 'Check the ESC and FC for shorts',
          detail: 'Multimeter in continuity mode across battery pads and 5V/GND before anything is soldered.',
          critical: true,
        },
      ],
    },
    {
      id: 'assembly',
      title: 'Assembly & soldering',
      items: [
        {
          id: 'q-frame',
          title: 'Assemble the frame and threadlock the arm screws',
          detail: 'Blue threadlocker on metal-to-metal screws only. Keep it off plastic parts.',
        },
        {
          id: 'q-mount-motors',
          title: 'Mount the motors',
          detail: 'Check screw length: a screw that touches the stator windings will short the motor.',
          critical: true,
        },
        {
          id: 'q-solder-motors',
          title: 'Solder motor wires to the ESC',
          detail:
            'Tin pads and wires first, keep joints shiny and wires short. Wire order only affects direction, which you fix in software.',
        },
        {
          id: 'q-battery-lead',
          title: 'Solder the battery lead and a low-ESR capacitor',
          detail:
            'The capacitor across the ESC power pads absorbs voltage spikes that kill ESCs and add video noise. Double-check polarity.',
          critical: true,
        },
        {
          id: 'q-stack',
          title: 'Mount the stack with soft-mount grommets',
          detail: 'FC arrow points forward, or note the rotation for gyro alignment later. Don’t overtighten the nuts.',
        },
        {
          id: 'q-wire-rx',
          title: 'Wire the receiver to a free UART',
          detail: 'RX TX goes to FC RX and vice versa. Write down which UART you used.',
        },
        {
          id: 'q-wire-vtx',
          title: 'Wire the video transmitter',
          detail:
            'Power from the pad that matches the VTX input range, plus the SmartAudio, Tramp or MSP line to a UART.',
        },
        {
          id: 'q-camera',
          title: 'Mount and wire the camera, set the uptilt',
          detail: 'Start around 20–30° for freestyle and adjust once you’ve flown.',
        },
        {
          id: 'q-gps',
          title: 'Mount the GPS with a clear sky view',
          detail: 'Keep it away from the VTX antenna and power wires. Wire it to its own UART.',
          when: { hasCategory: 'gps' },
        },
        {
          id: 'q-antennas',
          title: 'Fit the VTX and receiver antennas',
          detail: 'Never power a VTX without its antenna. It can burn out in seconds.',
          critical: true,
        },
        {
          id: 'q-smoke-test',
          title: 'First power-up through a smoke stopper, props off',
          detail: 'If the smoke stopper lights up and stays lit, unplug and look for a short.',
          critical: true,
        },
      ],
    },
    {
      id: 'setup',
      title: 'Firmware setup',
      items: [
        {
          id: 'q-bf-ports',
          title: 'Ports tab: assign the receiver, VTX and GPS UARTs',
          detail: 'Serial RX on the receiver UART, peripherals (VTX/GPS) on theirs. Save and reboot.',
          when: { firmware: ['betaflight', 'inav'] },
        },
        {
          id: 'q-ap-serial',
          title: 'Set SERIALx_PROTOCOL for the receiver, VTX and GPS',
          detail:
            'Receiver UART as RCIN (23), GPS as GPS (5), DJI/Walksnail OSD as DisplayPort (42). Reboot after changes.',
          when: { firmware: ['ardupilot'] },
        },
        {
          id: 'q-bind',
          title: 'Bind the receiver and check the channel map',
          detail:
            'Use the same binding phrase on radio and receiver. Sticks should move the right bars in the receiver tab.',
        },
        {
          id: 'q-orientation',
          title: 'Match board orientation to how the FC is mounted',
          detail:
            'Tilt the quad by hand: the 3D model must follow exactly. A wrong orientation flips the quad on arming.',
          critical: true,
        },
        {
          id: 'q-accel',
          title: 'Calibrate the accelerometer on a level surface',
        },
        {
          id: 'q-motor-order',
          title: 'Verify motor order and spin direction, props off',
          detail:
            'Spin each motor individually and compare against the firmware’s motor diagram. Fix direction in software, not by resoldering.',
          critical: true,
        },
        {
          id: 'q-modes',
          title: 'Set up arm, flight modes and beeper on switches',
          detail: 'Arm on its own switch. Add a beeper switch so you can find the quad in tall grass.',
        },
        {
          id: 'q-turtle',
          title: 'Add turtle mode on a switch',
          detail: 'Flips the quad back over after a crash.',
          when: { firmware: ['betaflight'] },
        },
        {
          id: 'q-failsafe',
          title: 'Configure and test failsafe, props off',
          detail: 'Arm, switch the radio off, and confirm the motors stop (or the RTH behaviour you chose).',
          critical: true,
        },
        {
          id: 'q-rth',
          title: 'Configure return-to-home',
          detail:
            'GPS Rescue in Betaflight, RTH in INAV, RTL in ArduPilot. Check the minimum satellite count and climb height.',
          when: { hasCategory: 'gps' },
        },
        {
          id: 'q-vtx-table',
          title: 'Load the VTX table and set band, channel and power',
          detail: 'Stay within your local legal frequencies and power limits.',
          when: { firmware: ['betaflight'] },
        },
        {
          id: 'q-vtx-settings',
          title: 'Set VTX band, channel and power',
          detail: 'Stay within your local legal frequencies and power limits.',
          when: { firmware: ['inav', 'ardupilot'] },
        },
        {
          id: 'q-osd',
          title: 'Lay out the OSD',
          detail: 'At minimum: battery voltage, mAh used, link quality, flight timer and warnings.',
        },
        {
          id: 'q-battery-warn',
          title: 'Set cell count warnings and battery capacity',
        },
        {
          id: 'q-backup',
          title: 'Save a backup of the configuration',
          detail: '“diff all” in the CLI, or a full parameter file in ArduPilot. Name it with the date.',
        },
      ],
    },
    {
      id: 'maiden',
      title: 'Maiden flight',
      items: [
        {
          id: 'q-props',
          title: 'Fit props in the right direction and tighten the nuts',
          detail: 'Leading edge follows the motor’s spin direction. Only now, at the field.',
          critical: true,
        },
        {
          id: 'q-preflight',
          title: 'Pre-flight: clear video, OSD readable, link quality solid',
        },
        {
          id: 'q-hover',
          title: 'Hover test, then land and feel the motors',
          detail: 'Listen for oscillation. Hot motors after 30 seconds of hovering mean a filter or tuning problem.',
          critical: true,
        },
        {
          id: 'q-blackbox',
          title: 'Record a blackbox log on the first packs',
          when: { firmware: ['betaflight', 'inav'] },
        },
        {
          id: 'q-tune',
          title: 'First tuning pass',
          detail: 'Filters first, then PIDs. Change one thing at a time.',
        },
      ],
    },
  ],
};
