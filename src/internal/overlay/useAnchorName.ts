import * as React from "react";

import { getFocusable } from "./focus";

/** An element that is a control itself, not a box around one. */
const CONTROL = "button, a[href], input, select, textarea, [tabindex]";

type AnchorName = { "aria-labelledby"?: string; "aria-label"?: string };

/**
 * The accessible name of a floating panel without a heading of its own (a menu, a popover with no
 * Title): the control it opened from — the trigger, or the control inside an anchor (the menu
 * button under `Popover.Anchor`, a row under `Dropdown.Anchor`) — by its id when it has one, else
 * by its `aria-label`, else by its text. Read from the DOM while open, never guessed: a child's own id wins over the
 * one the trigger was given. `named` — the panel has a heading that names it: nothing is read.
 */
export function useAnchorName(
  open: boolean,
  named: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
): AnchorName {
  const [name, setName] = React.useState<{ id?: string; label?: string }>({});
  React.useLayoutEffect(() => {
    if (!open || named) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const control = anchor.matches(CONTROL) ? anchor : (getFocusable(anchor)[0] ?? anchor);
    const next = control.id
      ? { id: control.id }
      : {
          label: control.getAttribute("aria-label") ?? (control.textContent?.trim() || undefined),
        };
    setName((current) => (current.id === next.id && current.label === next.label ? current : next));
  }, [open, named, anchorRef]);
  if (named) return {};
  return name.id ? { "aria-labelledby": name.id } : { "aria-label": name.label };
}
