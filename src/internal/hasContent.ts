import type * as React from "react";

/**
 * Whether a node draws something: `null`, `undefined`, booleans, `""` and lists of only those do
 * not (a label, hint, error or region slot with nothing in it takes no room).
 */
export function hasContent(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean" || node === "") return false;
  if (Array.isArray(node)) return node.some(hasContent);
  return true;
}
