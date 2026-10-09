import * as React from "react";

import { rovingIndex } from "@/internal/rovingFocus";

/**
 * Listboxes with a virtual highlight (`aria-activedescendant`), shared by Select, TagSelect and
 * CommandMenu. Options carry `data-value` and `data-label`; disabled ones `data-disabled="true"`.
 */

/** `id` of an option for `aria-activedescendant` (no spaces: a valid id). */
export const optionDomId = (listboxId: string, value: string) =>
  `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;

/** Enabled options of a listbox, in DOM order. */
export function enabledOptions(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled="true"])'),
  );
}

// ─── A small external store ──────────────────────────────────────────────────

export type Store<T> = {
  get: () => T;
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (Object.is(value, next)) return;
      value = next;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** One store per component instance. */
export function useCreateStore<T>(initial: T): Store<T> {
  return React.useState(() => createStore(initial))[0];
}

/**
 * Reads a slice of a store; re-renders only when the slice changes. An option subscribes to
 * `highlighted === value`, so moving the highlight re-renders two options, not the whole list.
 */
export function useStoreSlice<T, S>(store: Store<T>, select: (value: T) => S): S {
  const read = () => select(store.get());
  return React.useSyncExternalStore(store.subscribe, read, read);
}

// ─── Keyboard ────────────────────────────────────────────────────────────────

export type ListboxKeyContext = {
  items: HTMLElement[];
  highlight: Store<string | undefined>;
  onSelect: (value: string, label: string) => void;
};

/**
 * Arrows, Home and End move the highlight (wrapping); Enter and Space pick it. Escape is the layer
 * stack's (it closes the panel).
 */
export function handleListboxKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  { items, highlight, onSelect }: ListboxKeyContext,
): void {
  if (items.length === 0) return;
  const highlighted = highlight.get();
  const current = items.findIndex((item) => item.dataset.value === highlighted);
  const next = rovingIndex(event.key, current, items.length, "vertical");
  if (next !== null) {
    event.preventDefault();
    const item = items[next];
    highlight.set(item?.dataset.value);
    item?.scrollIntoView?.({ block: "nearest" });
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (highlighted === undefined) return;
    onSelect(highlighted, items[current]?.dataset.label ?? highlighted);
  }
}

/** A pause after which the typeahead buffer starts over. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * Typeahead by option label: the typed prefix finds the next match; the same letter repeated
 * cycles through the options that start with it. Returns the match to highlight.
 */
export function useTypeahead() {
  const state = React.useRef({ buffer: "", timer: 0 });
  React.useEffect(() => () => window.clearTimeout(state.current.timer), []);

  const isTyping = React.useCallback(() => state.current.buffer !== "", []);

  const find = React.useCallback(
    (key: string, items: HTMLElement[], highlighted: string | undefined) => {
      const s = state.current;
      window.clearTimeout(s.timer);
      s.buffer += key.toLocaleLowerCase();
      s.timer = window.setTimeout(() => {
        s.buffer = "";
      }, TYPEAHEAD_RESET_MS);
      const start = items.findIndex((item) => item.dataset.value === highlighted);
      const repeated = [...s.buffer].every((char) => char === s.buffer[0]);
      const prefix = repeated ? key.toLocaleLowerCase() : s.buffer;
      const from = repeated ? start + 1 : Math.max(start, 0);
      return [...items.slice(from), ...items.slice(0, from)].find((item) =>
        (item.dataset.label ?? "").toLocaleLowerCase().startsWith(prefix),
      );
    },
    [],
  );

  return { find, isTyping };
}

// ─── Load more at the end ────────────────────────────────────────────────────

/** The sentinel reports a little before it scrolls into view, so the next batch is ready. */
const LOAD_MORE_ROOT_MARGIN = "0px 0px 48px 0px";

export type LoadMoreOptions = {
  /** More can be requested now: `hasMore`, a handler, nothing loading, no load error. */
  enabled: boolean;
  onLoadMore: (() => void | Promise<void>) | undefined;
  /** The list's own scroller: the observer root. */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Changes when the list changes (a batch arrived): re-arms the request. */
  rearm: unknown;
};

/**
 * Load more at the end of a list (Select, CommandMenu): a sentinel after the last option asks once
 * per round when it scrolls into the list's own scroller; `request` asks the same way from the
 * keyboard (the highlight reached the last option). Without `IntersectionObserver` (jsdom, old
 * engines) only `request` asks.
 */
export function useLoadMore({ enabled, onLoadMore, scrollRef, rearm }: LoadMoreOptions) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const handlerRef = React.useRef(onLoadMore);
  handlerRef.current = onLoadMore;
  const askedRef = React.useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new round starts on every change
  React.useLayoutEffect(() => {
    askedRef.current = false;
  }, [enabled, rearm]);

  const request = React.useCallback(() => {
    if (!enabled || askedRef.current) return;
    askedRef.current = true;
    void handlerRef.current?.();
  }, [enabled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observed per round — a sentinel still in view reports again
  React.useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!enabled || !root || !target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) request();
      },
      { root, rootMargin: LOAD_MORE_ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rearm, request, scrollRef]);

  return { sentinelRef, request };
}
