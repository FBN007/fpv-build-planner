/** Short, sortable-enough local IDs like "prj_lz4k1q8x3f9a". No network sync, so no UUID needed. */
export function makeId(prefix: string): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8).padEnd(6, '0');
  return `${prefix}_${time}${rand}`;
}
