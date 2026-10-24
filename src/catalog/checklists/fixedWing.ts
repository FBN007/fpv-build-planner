import type { ChecklistTemplate } from '../../models/types';

export const fixedWingChecklist: ChecklistTemplate = {
  id: 'fixed_wing',
  version: 1,
  vehicleType: 'fixed_wing',
  phases: [
    {
      id: 'prep',
      title: 'Bench prep',
      items: [
        {
          id: 'fw-inventory',
          title: 'Lay out every part and check it against the plan',
          detail: 'Include control horns, clevises, pushrods and servo extensions. Kits often leave some of these out.',
        },
        {
          id: 'fw-flash-fc',
          title: 'Flash the flight controller firmware',
          detail: 'Use the exact board target for a wing FC.',
        },
        {
          id: 'fw-servo-center',
          title: 'Centre the servos electronically before fitting horns',
          detail:
            'Power the servos through the FC or a servo tester and let them settle at neutral first. Horns go on at 90° to the arm.',
          critical: true,
        },
      ],
    },
    {
      id: 'airframe',
      title: 'Airframe',
      items: [
        {
          id: 'fw-glue-wings',
          title: 'Glue the wing halves and spar',
          detail:
            'Use foam-safe glue: low-temp hot glue, foam-safe CA, or epoxy for the spar. Regular CA melts EPS foam.',
        },
        {
          id: 'fw-tail',
          title: 'Glue the tail surfaces square to the fuselage',
          detail: 'Check from behind that the horizontal stab is level with the wing.',
          when: { layout: ['conventional', 'v_tail'] },
        },
        {
          id: 'fw-fins',
          title: 'Fit the winglets or vertical fins',
          detail: 'They keep the wing tracking straight. Glue them dead vertical.',
          when: { layout: ['flying_wing'] },
        },
        {
          id: 'fw-hinges',
          title: 'Free up the control surface hinges',
          detail: 'Flex each surface fully back and forth a dozen times. Stiff hinges overload servos.',
        },
        {
          id: 'fw-servos',
          title: 'Install the servos',
          detail: 'Glue or tape them into their bays with leads routed so nothing chafes.',
        },
        {
          id: 'fw-pushrods',
          title: 'Fit control horns and pushrods with surfaces at neutral',
          detail: 'No binding through the full throw. Z-bends or clevises, nothing that can slip.',
        },
        {
          id: 'fw-motor',
          title: 'Mount the motor on the firewall',
          detail: 'Keep the kit’s down- and side-thrust angles if it specifies them.',
        },
        {
          id: 'fw-reinforce',
          title: 'Reinforce the leading edges and launch area',
          detail: 'Strapping tape on the leading edge and wherever your hand grips for launches.',
        },
      ],
    },
    {
      id: 'electronics',
      title: 'Electronics',
      items: [
        {
          id: 'fw-esc',
          title: 'Solder the ESC to the motor and battery lead',
          detail: 'If the ESC’s BEC powers the servos, make sure it can supply their combined stall current.',
          critical: true,
        },
        {
          id: 'fw-servo-outputs',
          title: 'Plug servos into the FC outputs your mixer expects',
          detail: 'Write the output-to-surface map down. You need it for setup.',
        },
        {
          id: 'fw-wire-rx',
          title: 'Wire the receiver to a free UART',
          detail: 'Antennas away from carbon, motor wires and the ESC.',
        },
        {
          id: 'fw-wire-vtx',
          title: 'Wire the video transmitter and camera',
          detail: 'Never power the VTX without its antenna.',
          critical: true,
        },
        {
          id: 'fw-gps',
          title: 'Mount the GPS with a clear sky view',
          detail: 'Top of the fuselage, away from the VTX antenna.',
          when: { hasCategory: 'gps' },
        },
        {
          id: 'fw-smoke-test',
          title: 'First power-up through a smoke stopper, prop off',
          critical: true,
        },
      ],
    },
    {
      id: 'setup',
      title: 'Firmware setup',
      items: [
        {
          id: 'fw-inav-mixer',
          title: 'Mixer: pick the platform preset and assign servo outputs',
          detail: 'Flying Wing or Airplane preset, then check each output drives the surface you expect.',
          when: { firmware: ['inav', 'betaflight'] },
        },
        {
          id: 'fw-ap-servos',
          title: 'Set SERVOn_FUNCTION for each output',
          detail: 'Elevons 77/78, aileron 4, elevator 19, rudder 21, V-tail 79/80, throttle 70.',
          when: { firmware: ['ardupilot'] },
        },
        {
          id: 'fw-orientation',
          title: 'Match board orientation to how the FC is mounted',
          critical: true,
        },
        {
          id: 'fw-accel',
          title: 'Calibrate the accelerometer at flying attitude',
          detail: 'Prop the wing up so it sits as it flies, not as it rests on the bench.',
        },
        {
          id: 'fw-bind',
          title: 'Bind the receiver and check the channel map',
        },
        {
          id: 'fw-manual-direction',
          title: 'Check surface directions in manual mode',
          detail: 'Right stick: right aileron goes up. Pull back: elevator goes up.',
          critical: true,
        },
        {
          id: 'fw-stab-direction',
          title: 'Check stabilisation directions in angle mode',
          detail:
            'Tilt the wing by hand: surfaces must push it back to level. Reversed stabilisation is the most common cause of maiden crashes.',
          critical: true,
        },
        {
          id: 'fw-throws',
          title: 'Set throws and endpoints to the kit’s values',
          detail: 'No servo buzzing at full deflection.',
        },
        {
          id: 'fw-modes',
          title: 'Set up arm, manual, angle and launch modes',
          detail: 'Launch mode in INAV, TAKEOFF or FBWA in ArduPilot. Add RTH if you have GPS.',
        },
        {
          id: 'fw-launch',
          title: 'Configure launch mode for hand launches',
          detail: 'Motor delay so the prop can’t hit your hand, and a climb throttle that actually climbs.',
          when: { firmware: ['inav'] },
        },
        {
          id: 'fw-failsafe',
          title: 'Configure and test failsafe, prop off',
          detail: 'With GPS: RTH. Without GPS: a gentle circling descent, never full throttle.',
          critical: true,
        },
        {
          id: 'fw-osd',
          title: 'Lay out the OSD',
          detail: 'Voltage, mAh used, link quality, altitude and speed. Add home arrow and distance with GPS.',
        },
        {
          id: 'fw-backup',
          title: 'Save a backup of the configuration',
        },
      ],
    },
    {
      id: 'maiden',
      title: 'CG & maiden',
      items: [
        {
          id: 'fw-cg',
          title: 'Balance the CG at the kit’s marked point with the flight battery',
          detail: 'Slightly nose-heavy flies. Tail-heavy doesn’t. Move the battery before adding weight.',
          critical: true,
        },
        {
          id: 'fw-range-check',
          title: 'Range check on the ground',
        },
        {
          id: 'fw-gps-lock',
          title: 'Wait for a 3D GPS fix and home point before launch',
          when: { hasCategory: 'gps' },
        },
        {
          id: 'fw-preflight',
          title: 'Control check right before launch',
          detail: 'Surfaces move the right way in manual and in angle mode. Every flight, not just the maiden.',
          critical: true,
        },
        {
          id: 'fw-hand-launch',
          title: 'Launch into the wind, wings level, slight nose up',
        },
        {
          id: 'fw-trim',
          title: 'Trim in the air, then run servo autotrim',
          when: { firmware: ['inav'] },
        },
        {
          id: 'fw-trim-generic',
          title: 'Trim in the air for straight and level flight',
          when: { firmware: ['ardupilot', 'betaflight'] },
        },
        {
          id: 'fw-autotune',
          title: 'Run autotune once it flies straight',
          when: { firmware: ['inav', 'ardupilot'] },
        },
      ],
    },
  ],
};
