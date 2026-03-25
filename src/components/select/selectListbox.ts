import type * as React from "react";

/** Опции listbox: только включённые пункты (без `data-disabled`). */
export function queryEnabledSelectOptions(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled="true"])'),
  );
}

export type SelectListboxKeyboardContext = {
  items: HTMLElement[];
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  onSelect: (value: string, label: string) => void;
  onClose: () => void;
};

/** Обработка клавиш для `role="listbox"` (стрелки, Home/End, Enter, Space, Escape). */
export function handleSelectListboxKeyDown(
  e: React.KeyboardEvent<HTMLDivElement>,
  ctx: SelectListboxKeyboardContext,
): void {
  const { items, highlightedValue, setHighlightedValue, onSelect, onClose } = ctx;
  if (items.length === 0) return;

  const currentIndex = items.findIndex((i) => i.dataset.value === highlightedValue);

  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      setHighlightedValue(items[next]?.dataset.value);
      items[next]?.scrollIntoView?.({ block: "nearest" });
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      setHighlightedValue(items[prev]?.dataset.value);
      items[prev]?.scrollIntoView?.({ block: "nearest" });
      break;
    }
    case "Home": {
      e.preventDefault();
      setHighlightedValue(items[0]?.dataset.value);
      items[0]?.scrollIntoView?.({ block: "nearest" });
      break;
    }
    case "End": {
      e.preventDefault();
      const last = items[items.length - 1];
      setHighlightedValue(last?.dataset.value);
      last?.scrollIntoView?.({ block: "nearest" });
      break;
    }
    case "Enter":
    case " ": {
      e.preventDefault();
      if (highlightedValue) {
        const item = items.find((i) => i.dataset.value === highlightedValue);
        const label = item?.dataset.label ?? item?.textContent?.trim() ?? highlightedValue;
        onSelect(highlightedValue, label);
      }
      break;
    }
    case "Escape": {
      e.preventDefault();
      onClose();
      break;
    }
    default:
      break;
  }
}
