import type * as React from "react";

/**
 * A row or a card that opens (a DataTable row, a Kanban card, a Gantt row): a click on it opens it,
 * a link of its own (`data-row-link`) stretches over it. The elements inside that are controls of
 * their own never open it, and on a link host they sit above the stretched link —
 * `rowLink.module.css` `.host` lists the same selectors (a test keeps the two lists equal).
 * `data-row-click-ignore` marks a custom widget.
 */
const ROW_CONTROLS = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  '[contenteditable="true"]',
  '[contenteditable=""]',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="tab"]',
  '[role="slider"]',
  '[role="combobox"]',
  '[role="textbox"]',
  "[data-row-click-ignore]",
] as const;

const CONTROL_SELECTOR = ROW_CONTROLS.join(", ");

/**
 * Whether a click on a row should open it: it started inside the row's own DOM (React events
 * bubble out of portals — a ⋯ menu item in a cell — and those never count), not on a control
 * inside the row, and it did not end a text selection inside the row.
 */
export function opensRow(event: React.SyntheticEvent<HTMLElement>): boolean {
  const row = event.currentTarget;
  const target = event.target;
  if (!(target instanceof Element) || !row.contains(target)) return false;
  const control = target.closest(CONTROL_SELECTOR);
  if (
    control &&
    control !== row &&
    row.contains(control) &&
    // The row's own link opens the row: it is not a control inside it.
    !control.hasAttribute("data-row-link")
  ) {
    return false;
  }
  const selection = typeof window === "undefined" ? null : window.getSelection();
  if (selection && !selection.isCollapsed && row.contains(selection.anchorNode)) return false;
  return true;
}

/** A plain primary click: no modifier, so a link row may open in place instead of navigating. */
export function isPlainClick(event: React.MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
