/**
 * Join class names, skipping falsy values.
 * Intentionally tiny (no clsx / tailwind-merge dependency). Convention: a component's
 * `className` prop is for *layout* (margin, width, grid placement), never for overriding
 * its visual tokens — so class conflicts never need merging.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
