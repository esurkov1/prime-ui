/** Primitive variables: `--prime-ref-*`. */
export const REF_PREFIX = "--prime-ref";
/** Semantic variables: `--prime-*`. */
export const SYS_PREFIX = "--prime";

/** Token path → CSS variable: `color.text.primary` → `--prime-color-text-primary`, camelCase → kebab-case. */
export function toVarName(path: string, prefix: string = SYS_PREFIX): string {
  return `${prefix}-${path
    .replaceAll(".", "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()}`;
}
