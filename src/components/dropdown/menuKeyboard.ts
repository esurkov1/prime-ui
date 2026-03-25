import type * as React from "react";

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([data-disabled="true"])';

export function queryEnabledMenuItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
}

export function handleMenuNavigationKeyDown(
  e: React.KeyboardEvent<HTMLElement>,
  container: HTMLElement,
): void {
  const items = queryEnabledMenuItems(container);
  if (items.length === 0) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);

  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[next]?.focus();
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prev]?.focus();
      break;
    }
    case "Home": {
      e.preventDefault();
      items[0]?.focus();
      break;
    }
    case "End": {
      e.preventDefault();
      items[items.length - 1]?.focus();
      break;
    }
    default:
      break;
  }
}
