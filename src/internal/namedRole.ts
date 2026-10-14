import type * as React from "react";

type NamedProps = {
  role?: React.AriaRole;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * The role of a generic element (`<div>`, `<span>`) that the consumer may name: a name on an
 * element without a role is ignored by assistive tech, so a named element takes `role` (`group`
 * for a panel, `img` for a mark). An explicit `role` wins; an unnamed element keeps none.
 */
export function namedRole(props: NamedProps, role: React.AriaRole): React.AriaRole | undefined {
  if (props.role !== undefined) return props.role;
  return props["aria-label"] || props["aria-labelledby"] ? role : undefined;
}
