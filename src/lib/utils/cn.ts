/**
 * Superset of Svelte's own `ClassValue` (which comes from clsx and includes
 * `bigint`), so a `class` prop taken straight off `HTMLAttributes` can be
 * forwarded here without a cast at every call site.
 */
export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, unknown>;

/**
 * Tiny class-name joiner (clsx semantics, ~20 lines, zero deps).
 *
 * The library has no Tailwind dependency, so there is nothing to "merge" —
 * conflicting utilities are not a failure mode here. Consumers pass a `class`
 * prop through to a component root and it lands last in the attribute, after
 * the component's own scoped classes.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'bigint') {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }

  return out.join(' ');
}
