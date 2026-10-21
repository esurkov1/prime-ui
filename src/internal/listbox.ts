import * as React from "react";

import { rovingIndex } from "@/internal/rovingFocus";

/**
 * Listboxes with a virtual highlight (`aria-activedescendant`), shared by Select, TagSelect and
 * CommandMenu: the item registry, the highlight store, the keyboard and the typeahead. Focus stays
 * on the field (the search, the listbox); the highlight is a value, and Enter activates the
 * highlighted item through the registry, never through a synthetic DOM click.
 */

/** `id` of an option for `aria-activedescendant` (no spaces: a valid id). */
export const optionDomId = (listboxId: string, value: string) =>
  `${listboxId}-opt-${value.replace(/\s+/g, "_")}`;

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

// ─── Item registry ───────────────────────────────────────────────────────────

/** What an item tells its listbox. */
type ListboxItem = {
  /** The visible name: typeahead, the trigger after the list closed, announcements. */
  label: string;
  /** The text a query is matched against, in lower case. */
  haystack: string;
  /** Shown but skipped by the arrows and never activated. */
  disabled?: boolean;
  /** Shown whatever the query, after the matches (create from the query, an action row). */
  persistent?: boolean;
  /** The item's palette hue (a status option), kept like the label for the closed trigger. */
  color?: string;
  /** What Enter on the highlighted item and a click on it do. */
  onActivate: () => void;
};

/** The items a query leaves on screen. */
type ListboxView = {
  /** Shown items: the matches, then the persistent ones. */
  visible: ReadonlySet<string>;
  /** Shown, enabled items in their order: what the arrows walk. */
  navigable: readonly string[];
  /** Shown items that match the query (persistent ones apart): the empty state. */
  matchCount: number;
};

type Entry = ListboxItem & { order: number; mounted: number; node: () => Element | null };

export type ListboxRegistry = {
  /** Registers a mounted item (from a layout effect); returns the unregistration. */
  register: (id: string, item: ListboxItem, node?: () => Element | null) => () => void;
  /** Runs the item's `onActivate`; `false` when it is unknown, unmounted or disabled. */
  activate: (id: string) => boolean;
  /** The item's label, kept after it unmounts (the trigger of a closed list); else the id. */
  labelOf: (id: string) => string;
  /** The item's palette hue, kept after it unmounts; `undefined` when it has none. */
  colorOf: (id: string) => string | undefined;
  /** The item's element, to bring the highlight into view. */
  nodeOf: (id: string) => Element | null;
  /** The items a query leaves on screen; the same object until an item or the query changes. */
  view: (query: string, filter: boolean) => ListboxView;
  subscribe: (listener: () => void) => () => void;
};

/**
 * The items of one listbox in their order: the order an id first registered in, kept while it
 * unmounts and comes back (a filter, a closed panel), so a list never reshuffles.
 */
function createListboxRegistry(): ListboxRegistry {
  const entries = new Map<string, Entry>();
  const listeners = new Set<() => void>();
  // One view per query: readers with different queries (the trigger's labels, the open panel)
  // each get a stable snapshot until an item changes.
  const cached = new Map<string, ListboxView>();
  const changed = () => {
    cached.clear();
    for (const listener of [...listeners]) listener();
  };

  return {
    register(id, item, node = () => null) {
      const known = entries.get(id);
      entries.set(id, {
        ...item,
        order: known?.order ?? entries.size,
        mounted: (known?.mounted ?? 0) + 1,
        node,
      });
      changed();
      return () => {
        const current = entries.get(id);
        if (current) current.mounted -= 1;
        changed();
      };
    },
    activate(id) {
      const entry = entries.get(id);
      if (!entry || entry.mounted <= 0 || entry.disabled) return false;
      entry.onActivate();
      return true;
    },
    labelOf: (id) => entries.get(id)?.label ?? id,
    colorOf: (id) => entries.get(id)?.color,
    nodeOf: (id) => entries.get(id)?.node() ?? null,
    view(query, filter) {
      const key = `${filter ? "f" : "a"}:${query}`;
      const known = cached.get(key);
      if (known) return known;
      const needle = query.trim().toLocaleLowerCase();
      const shown = [...entries.entries()]
        .filter(
          ([, entry]) =>
            entry.mounted > 0 && (entry.persistent || !filter || entry.haystack.includes(needle)),
        )
        // Persistent items stand at the end: the arrows reach them after the matches, whenever
        // the matches arrived.
        .sort(([, a], [, b]) => Number(a.persistent) - Number(b.persistent) || a.order - b.order);
      const view: ListboxView = {
        visible: new Set(shown.map(([id]) => id)),
        navigable: shown.filter(([, entry]) => !entry.disabled).map(([id]) => id),
        matchCount: shown.filter(([, entry]) => !entry.persistent).length,
      };
      cached.set(key, view);
      return view;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** One registry per listbox instance. */
export function useListboxRegistry(): ListboxRegistry {
  return React.useState(createListboxRegistry)[0];
}

/** The items `query` leaves on screen; re-renders when an item (un)registers or changes. */
export function useListboxView(registry: ListboxRegistry, query = "", filter = true): ListboxView {
  const read = () => registry.view(query, filter);
  return React.useSyncExternalStore(registry.subscribe, read, read);
}

/**
 * Registers an item while it is mounted. `onActivate` is read when it runs, so a new handler every
 * render does not re-register the item; `nodeRef` is the element the highlight brings into view.
 */
export function useListboxItem(
  registry: ListboxRegistry,
  id: string,
  item: ListboxItem,
  nodeRef?: React.RefObject<Element | null>,
): void {
  const activateRef = React.useRef(item.onActivate);
  React.useLayoutEffect(() => {
    activateRef.current = item.onActivate;
  });
  const { label, haystack, disabled = false, persistent = false, color } = item;
  React.useLayoutEffect(
    () =>
      registry.register(
        id,
        { label, haystack, disabled, persistent, color, onActivate: () => activateRef.current() },
        () => nodeRef?.current ?? null,
      ),
    [registry, id, label, haystack, disabled, persistent, color, nodeRef],
  );
}

// ─── Keyboard ────────────────────────────────────────────────────────────────

/**
 * A key that belongs to an input method composing text (a Chinese, Japanese or Korean IME, a
 * dictation): its Enter confirms the composition and its arrows pick a candidate, so a listbox
 * leaves them alone. Safari reports such keys as `keyCode` 229 without `isComposing`.
 */
export function isComposingKey(event: React.KeyboardEvent): boolean {
  return event.nativeEvent.isComposing || event.keyCode === 229;
}

/**
 * Brings the highlighted option into view inside the list's own scroller after a keyboard move
 * (`block: "nearest"`); a highlight that follows the pointer never scrolls.
 */
export function revealHighlighted(element: Element | null | undefined): void {
  element?.scrollIntoView({ block: "nearest" });
}

type ListboxKeyContext = {
  /** The navigable items, in order. */
  ids: readonly string[];
  highlight: Store<string | undefined>;
  /** Enter and Space on the highlighted item (the registry's `activate`). */
  activate: (id: string) => void;
};

/**
 * Arrows, Home and End move the highlight (wrapping); Enter and Space activate it. Escape is the
 * layer stack's (it closes the panel); a key of a composing input method is left alone. Returns
 * the item the highlight moved to, for the host to reveal (`revealHighlighted`), or `null`.
 */
export function handleListboxKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  { ids, highlight, activate }: ListboxKeyContext,
): string | null {
  if (ids.length === 0 || isComposingKey(event)) return null;
  const highlighted = highlight.get();
  const next = rovingIndex(event.key, ids.indexOf(highlighted ?? ""), ids.length, "vertical");
  if (next !== null) {
    event.preventDefault();
    const id = ids[next] ?? null;
    highlight.set(id ?? undefined);
    return id;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (highlighted !== undefined && ids.includes(highlighted)) activate(highlighted);
  }
  return null;
}

/** A pause after which the typeahead buffer starts over. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * Typeahead by item label: the typed prefix finds the next match; the same letter repeated cycles
 * through the items that start with it. Returns the match to highlight.
 */
export function useTypeahead() {
  const state = React.useRef({ buffer: "", timer: 0 });
  React.useEffect(() => () => window.clearTimeout(state.current.timer), []);

  const isTyping = React.useCallback(() => state.current.buffer !== "", []);

  const find = React.useCallback(
    (
      key: string,
      ids: readonly string[],
      highlighted: string | undefined,
      labelOf: (id: string) => string,
    ) => {
      const s = state.current;
      window.clearTimeout(s.timer);
      s.buffer += key.toLocaleLowerCase();
      s.timer = window.setTimeout(() => {
        s.buffer = "";
      }, TYPEAHEAD_RESET_MS);
      const start = ids.indexOf(highlighted ?? "");
      const repeated = [...s.buffer].every((char) => char === s.buffer[0]);
      const prefix = repeated ? key.toLocaleLowerCase() : s.buffer;
      const from = repeated ? start + 1 : Math.max(start, 0);
      return [...ids.slice(from), ...ids.slice(0, from)].find((id) =>
        labelOf(id).toLocaleLowerCase().startsWith(prefix),
      );
    },
    [],
  );

  return { find, isTyping };
}
