/** Join class names, skipping falsy values. Callers avoid conflicting utilities. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
