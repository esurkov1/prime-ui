import type * as React from "react";

import { createComponentContext } from "@/internal/context";
import { createStore, type Store } from "@/internal/listbox";
import type { ControlSize } from "@/internal/states";

export type SelectLabels = {
  /** Placeholder and accessible name of the search field (`Select.Content searchable`). */
  search: string;
  /** Empty state: no items or nothing matches. */
  empty: string;
  /** Second line of the empty state while searching; `""` hides it. */
  emptyHint: string;
  /** Announced while `loading` or `loadingMore`. */
  loading: string;
  /** The retry button of the load error (`onRetry`). */
  retry: string;
  /** Tooltip of the clear segment (`clearable`). */
  clear: string;
  /** Muted marker after the label when `optional`. */
  optional: string;
  /** Announced when the `onValueChange` promise rejects and the value rolls back. */
  changeFailed: string;
};

export const normalize = (text: string) => text.trim().toLocaleLowerCase();

type ItemEntry = { label: string; haystack: string; mounted: number };

/**
 * The items of a Select: their labels (shown in the trigger; kept after an item unmounts, so the
 * label does not flicker while the list moves between the closed registry and the open panel)
 * and the mounted ones with their search text (the empty state). `version` changes on every
 * (un)registration.
 */
export type ItemRegistry = {
  version: Store<number>;
  labelOf: (value: string) => string;
  /** Registers a mounted item; returns the unregistration. */
  register: (value: string, label: string, haystack: string) => () => void;
  /** Some mounted item matches the normalized query. */
  anyMatch: (query: string) => boolean;
};

export function createItemRegistry(): ItemRegistry {
  const entries = new Map<string, ItemEntry>();
  const version = createStore(0);
  const bump = () => version.set(version.get() + 1);
  return {
    version,
    labelOf: (value) => entries.get(value)?.label ?? value,
    register: (value, label, haystack) => {
      const entry = entries.get(value);
      entries.set(value, { label, haystack, mounted: (entry?.mounted ?? 0) + 1 });
      bump();
      return () => {
        const current = entries.get(value);
        if (current) current.mounted -= 1;
        bump();
      };
    },
    anyMatch: (query) => {
      for (const entry of entries.values()) {
        if (entry.mounted > 0 && (query === "" || entry.haystack.includes(query))) return true;
      }
      return false;
    },
  };
}

export type SelectContextValue = {
  size: ControlSize;
  invalid: boolean;
  focusRing: boolean;
  required: boolean;
  disabled: boolean;
  placeholder: string | undefined;
  multiple: boolean;
  /** Selected values: one or none in single mode. */
  selected: string[];
  registry: ItemRegistry;
  pick: (value: string) => void;
  clear: () => void;
  clearable: boolean;
  loading: boolean;
  /** A promise from `onValueChange` is pending: the trigger is busy, picks wait. */
  saving: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: (() => void | Promise<void>) | undefined;
  loadError: React.ReactNode;
  onRetry: (() => void) | undefined;
  /** The kit filters the items by the query; `false` for results from a server. */
  filter: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** The highlighted option; items subscribe to their own slice of it. */
  highlight: Store<string | undefined>;
  query: string;
  setQuery: (query: string) => void;
  triggerId: string;
  listboxId: string;
  describedBy: string | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  labels: SelectLabels;
};

export const [SelectProvider, useSelectContext] =
  createComponentContext<SelectContextValue>("Select");
