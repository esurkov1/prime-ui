import type * as React from "react";

import { rovingIndex } from "@/internal/rovingFocus";

/**
 * Keyboard of a listbox with a virtual highlight (`aria-activedescendant`), shared by Select and
 * TagSelect. Options carry `data-value` and `data-label`; disabled ones `data-disabled="true"`.
 */

/** Enabled options of a listbox, in DOM order. */
export function enabledOptions(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled="true"])'),
  );
}

export type ListboxKeyContext = {
  items: HTMLElement[];
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  onSelect: (value: string, label: string) => void;
  onClose: () => void;
};

/** Arrows, Home and End move the highlight (wrapping); Enter and Space pick it; Escape closes. */
export function handleListboxKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  { items, highlightedValue, setHighlightedValue, onSelect, onClose }: ListboxKeyContext,
): void {
  if (event.key === "Escape") {
    event.preventDefault();
    onClose();
    return;
  }
  if (items.length === 0) return;
  const current = items.findIndex((item) => item.dataset.value === highlightedValue);
  const next = rovingIndex(event.key, current, items.length, "vertical");
  if (next !== null) {
    event.preventDefault();
    const item = items[next];
    setHighlightedValue(item?.dataset.value);
    item?.scrollIntoView?.({ block: "nearest" });
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (highlightedValue === undefined) return;
    onSelect(highlightedValue, items[current]?.dataset.label ?? highlightedValue);
  }
}
