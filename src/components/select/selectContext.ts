import type * as React from "react";

import { createComponentContext } from "@/internal/context";
import type { ListboxRegistry, Store } from "@/internal/listbox";
import type { ControlSize } from "@/internal/states";

export type SelectLabels = {
  /** Placeholder and accessible name of the search field (`Select.Content searchable`). */
  search: string;
  /** Empty state: no items or nothing matches. */
  empty: string;
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

/** `field`: the field trigger. `status`: a chip in the picked option's hue with a chevron. */
export type SelectVariant = "field" | "status";

export type SelectContextValue = {
  size: ControlSize;
  variant: SelectVariant;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  placeholder: string | undefined;
  multiple: boolean;
  /** Selected values: one or none in single mode. */
  selected: string[];
  /** The items and actions of the list (`@/internal/listbox`): labels, the query view, Enter. */
  registry: ListboxRegistry;
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
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  /** The highlighted option; items subscribe to their own slice of it. */
  highlight: Store<string | undefined>;
  query: string;
  setQuery: (query: string) => void;
  triggerId: string;
  listboxId: string;
  describedBy: string | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  labels: SelectLabels;
  /**
   * The select is the start segment of a field box (`Input.Wrapper`): its trigger is a segment
   * named by the root's `aria-label` and the picked value.
   */
  segment: { label: string | undefined } | null;
  /** A `status` select with no visible `label`: the root's `aria-label` names its trigger. */
  statusLabel: string | undefined;
};

export const [SelectProvider, useSelectContext] =
  createComponentContext<SelectContextValue>("Select");
