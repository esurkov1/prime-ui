import * as React from "react";

import { setControlValue } from "@/internal/controlValue";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { HighlightMatch } from "@/internal/HighlightMatch";
import {
  isComposingKey,
  optionDomId,
  revealHighlighted,
  type Store,
  useCreateStore,
  useStoreSlice,
} from "@/internal/listbox";
import listRowStyles from "@/internal/listRow.module.css";
import { menuRowProps, menuRowTier } from "@/internal/MenuGroup";
import menu from "@/internal/menu.module.css";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize } from "@/internal/states";

/** The suggestions the typed text leaves: every one that contains it, except the text itself. */
function matchesOf(items: readonly string[], text: string): string[] {
  const query = text.trim().toLocaleLowerCase();
  const found = items.filter((item) => item.toLocaleLowerCase().includes(query));
  // The value is already one of them: nothing to suggest.
  return found.length === 1 && found[0]?.toLocaleLowerCase() === query ? [] : found;
}

/** The suggestion list of a free-text field (`Input.Root suggestions`): a combobox. */
export type InputSuggestions = {
  listboxId: string;
  /** The name of the list: the field's label. */
  labelledBy: string | undefined;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  /** The field box: the panel's anchor, as wide as it. */
  anchorRef: React.RefObject<HTMLDivElement | null>;
  matches: string[];
  query: string;
  shown: boolean;
  highlight: Store<string | undefined>;
  setOpen: (open: boolean) => void;
  pick: (item: string) => void;
  /** The input's combobox attributes and handlers, run after the consumer's. */
  onInput: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onBlur: () => void;
};

/**
 * Suggestions under a free-text field: the field keeps the focus and its text is the value; the
 * list shows the suggestions that contain the text, the arrows move a virtual highlight
 * (`aria-activedescendant`), Enter or a press puts the highlighted one into the field (as typing
 * would), Escape closes the list. `null` without suggestions.
 */
export function useInputSuggestions(
  items: readonly string[] | undefined,
  inputRef: React.RefObject<HTMLInputElement | null>,
  listboxId: string,
  labelledBy: string | undefined,
  { closeOnEscape, closeOnOutsideClick }: { closeOnEscape: boolean; closeOnOutsideClick: boolean },
): InputSuggestions | null {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const highlight = useCreateStore<string | undefined>(undefined);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  // A pick writes the text through the input: its own change event must not reopen the list.
  const pickingRef = React.useRef(false);
  const list = items ?? [];
  const matches = React.useMemo(() => (items ? matchesOf(items, query) : []), [items, query]);
  const shown = open && matches.length > 0;

  // A highlight the new text filtered out goes.
  React.useEffect(() => {
    const current = highlight.get();
    if (current !== undefined && !matches.includes(current)) highlight.set(undefined);
  }, [matches, highlight]);

  const close = React.useCallback(() => {
    setOpen(false);
    highlight.set(undefined);
  }, [highlight]);

  const openFromField = () => {
    const input = inputRef.current;
    if (!input || input.disabled || input.readOnly) return null;
    setQuery(input.value);
    setOpen(true);
    return matchesOf(list, input.value);
  };

  if (!items) return null;

  const pick = (item: string) => {
    const input = inputRef.current;
    close();
    setQuery(item);
    if (!input) return;
    pickingRef.current = true;
    setControlValue(input, item);
    pickingRef.current = false;
  };

  return {
    listboxId,
    labelledBy,
    closeOnEscape,
    closeOnOutsideClick,
    anchorRef,
    matches,
    query,
    shown,
    highlight,
    setOpen: (next) => (next ? openFromField() : close()),
    pick,
    onInput: (value) => {
      if (pickingRef.current) return;
      setQuery(value);
      setOpen(true);
      highlight.set(undefined);
    },
    onKeyDown: (event) => {
      if (event.defaultPrevented || isComposingKey(event)) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!shown) {
          const found = openFromField();
          // Alt + ArrowDown only opens; an arrow alone also lands on the first (last) one.
          if (found && !event.altKey) {
            highlight.set(event.key === "ArrowDown" ? found[0] : found.at(-1));
          }
          return;
        }
        const next = rovingIndex(
          event.key,
          matches.indexOf(highlight.get() ?? ""),
          matches.length,
          "vertical",
        );
        const id = next === null ? undefined : matches[next];
        highlight.set(id);
        if (id !== undefined)
          revealHighlighted(document.getElementById(optionDomId(listboxId, id)));
        return;
      }
      if (!shown) return;
      const highlighted = highlight.get();
      if (event.key === "Enter" && highlighted !== undefined) {
        event.preventDefault();
        pick(highlighted);
      } else if (event.key === "Escape" && closeOnEscape) {
        // The list closes first; the field (and a dialog around it) keeps this Escape.
        event.preventDefault();
        close();
      } else if (event.key === "Tab" || event.key === "Enter") {
        // Enter without a highlight keeps the typed text (and submits the form, as it would).
        close();
      }
    },
    onClick: () => {
      if (!shown) openFromField();
    },
    onBlur: close,
  };
}

/** The floating list of an `Input.Root` with `suggestions`, anchored to the field box. */
export function InputSuggestionList({
  suggest,
  size,
}: {
  suggest: InputSuggestions;
  size: ControlSize;
}) {
  const floating = useFloatingLayer({
    open: suggest.shown,
    onOpenChange: suggest.setOpen,
    triggerRef: suggest.anchorRef,
    closeOnEscape: suggest.closeOnEscape,
    closeOnOutsideClick: suggest.closeOnOutsideClick,
    matchAnchorWidth: true,
  });
  return (
    <FloatingPanel
      floating={floating}
      size={size}
      scroll
      width="trigger"
      className={cx(fieldTierClass, menu.tier, menu.menu)}
    >
      <div
        id={suggest.listboxId}
        role="listbox"
        aria-labelledby={suggest.labelledBy}
        className={menu.list}
      >
        {suggest.matches.map((item) => (
          <SuggestionOption key={item} item={item} suggest={suggest} size={menuRowTier(size)} />
        ))}
      </div>
    </FloatingPanel>
  );
}

/** A suggestion: the list row, a tier below the panel, its match with the typed text marked. */
function SuggestionOption({
  item,
  suggest,
  size,
}: {
  item: string;
  suggest: InputSuggestions;
  size: ControlSize;
}) {
  const highlighted = useStoreSlice(suggest.highlight, (value) => value === item);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard stays in the field (`aria-activedescendant`)
    <div
      id={optionDomId(suggest.listboxId, item)}
      role="option"
      tabIndex={-1}
      aria-selected={highlighted}
      {...menuRowProps({ size, highlighted })}
      // The field keeps the focus: a press must not blur it before the pick.
      onMouseDown={(event) => event.preventDefault()}
      onMouseMove={() => {
        if (!highlighted) suggest.highlight.set(item);
      }}
      onClick={() => suggest.pick(item)}
    >
      <span className={listRowStyles.title}>
        <HighlightMatch text={item} query={suggest.query} />
      </span>
    </div>
  );
}
