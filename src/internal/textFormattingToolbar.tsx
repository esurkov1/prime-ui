import * as React from "react";

import { Button } from "@/components/button/Button";
import { Kbd } from "@/components/kbd/Kbd";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { usePresence } from "@/hooks/usePresence";
import { Icon, type IconName } from "@/icons";
import { cx } from "./cx";
import overlayMotion from "./overlayMotion.module.css";
import { rovingIndex } from "./rovingFocus";
import { type ControlSize, stepDown } from "./states";
import { SurfaceDepthProvider } from "./surfaceDepth";
import {
  applyFormat,
  diffRange,
  FORMAT_SHORTCUTS,
  formatForKey,
  shortcutText,
  TEXT_FORMATS,
  type TextFormat,
  type TextFormattingLabels,
} from "./textFormatting";
import styles from "./textFormattingToolbar.module.css";

/*
 * Markdown formatting of a textarea's selection (Composer, Textarea `formatting`): the hotkeys, the
 * floating toolbar over a selection, and the edit typed into the field so it stays on its undo stack.
 * The host renders `toolbar` inside a `position: relative` box around the field and spreads
 * `anchorProps` on it (the toolbar shows while the focus is in that box).
 */

const TOOL_ICONS: Record<TextFormat, IconName> = {
  bold: "format.bold",
  italic: "format.italic",
  strikethrough: "format.strikethrough",
  code: "format.code",
  spoiler: "format.spoiler",
  link: "format.link",
  quote: "format.quote",
};

const isApplePlatform = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

/** Puts `text` into the field as a person would type it: React's `onChange` sees the change. */
function typeValue(el: HTMLTextAreaElement, text: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  if (setter) setter.call(el, text);
  else el.value = text;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export type TextFormattingOptions = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** The hotkeys and the toolbar. */
  enabled: boolean;
  /** Whether the toolbar may show now (not while the field is disabled, read-only or covered). */
  toolbar: boolean;
  labels: TextFormattingLabels;
  /** Tier of the field; the tools stand one tier smaller. */
  size: ControlSize;
  /** Id of the textarea (`aria-controls` of the toolbar). */
  controlsId?: string;
};

export type TextFormatting = {
  /** On the textarea's `onSelect`. */
  onSelect: () => void;
  /** Call first in the textarea's `onKeyDown`; `true` when the key was a formatting one and is used. */
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => boolean;
  /** On the `position: relative` box around the field and the toolbar. */
  anchorProps: Pick<React.HTMLAttributes<HTMLElement>, "onFocus" | "onBlur">;
  /** The toolbar while it shows or leaves. */
  toolbar: React.ReactNode;
};

export function useTextFormatting({
  textareaRef,
  enabled,
  toolbar: toolbarAllowed,
  labels,
  size,
  controlsId,
}: TextFormattingOptions): TextFormatting {
  const [selected, setSelected] = React.useState(false);
  const [focusInside, setFocusInside] = React.useState(false);
  const [apple, setApple] = React.useState(false);
  React.useEffect(() => setApple(isApplePlatform()), []);
  const open = enabled && toolbarAllowed && selected && focusInside;
  const presence = usePresence(open, { exitDuration: "fast" });
  const [toolIndex, setToolIndex] = React.useState(0);
  const toolRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const syncSelection = () => {
    const el = textareaRef.current;
    setSelected(Boolean(el && el.selectionStart !== el.selectionEnd));
  };

  const apply = (format: TextFormat) => {
    const el = textareaRef.current;
    if (!el || el.disabled || el.readOnly) return;
    const before = { text: el.value, start: el.selectionStart, end: el.selectionEnd };
    const next = applyFormat(before, format);
    const change = diffRange(before.text, next.text);
    el.focus();
    el.setSelectionRange(change.start, change.end);
    // Typed as one edit, the change stays on the field's undo stack (Mod+Z takes it back).
    let typed = false;
    try {
      typed =
        typeof document.execCommand === "function" &&
        document.execCommand(change.insert ? "insertText" : "delete", false, change.insert);
    } catch {
      typed = false;
    }
    if (!typed || el.value !== next.text) typeValue(el, next.text);
    el.setSelectionRange(next.start, next.end);
    syncSelection();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enabled || event.nativeEvent.isComposing) return false;
    const format = formatForKey(event);
    if (format) {
      event.preventDefault();
      apply(format);
      return true;
    }
    if (event.key === "Escape" && open) {
      const el = event.currentTarget;
      event.preventDefault();
      el.setSelectionRange(el.selectionEnd, el.selectionEnd);
      setSelected(false);
      return true;
    }
    return false;
  };

  const anchorProps: TextFormatting["anchorProps"] = {
    onFocus: () => setFocusInside(true),
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusInside(false);
      }
    },
  };

  const toolSize = stepDown(size);
  const toolbar = presence.mounted ? (
    <SurfaceDepthProvider value="floating">
      <div
        role="toolbar"
        aria-label={labels.formatting}
        aria-controls={controlsId}
        className={cx(styles.toolbar, overlayMotion.floating)}
        data-depth="floating"
        data-side="top"
        data-state={presence.state}
        onAnimationEnd={presence.onExitEnd}
        // The field keeps its focus and its selection while a tool is pressed.
        onPointerDown={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          const next = rovingIndex(event.key, toolIndex, TEXT_FORMATS.length, "horizontal");
          if (next === null) return;
          event.preventDefault();
          setToolIndex(next);
          toolRefs.current[next]?.focus();
        }}
      >
        <Tooltip.Provider>
          {TEXT_FORMATS.map((format, index) => {
            const shortcut = FORMAT_SHORTCUTS[format];
            return (
              <Tooltip.Root key={format}>
                <Tooltip.Trigger>
                  <Button.Root
                    ref={(node) => {
                      toolRefs.current[index] = node;
                    }}
                    variant="ghost"
                    tone="neutral"
                    size={toolSize}
                    aria-label={labels[format]}
                    aria-keyshortcuts={`${apple ? "Meta" : "Control"}+${shortcut.shift ? "Shift+" : ""}${shortcut.key}`}
                    tabIndex={index === toolIndex ? 0 : -1}
                    onClick={() => apply(format)}
                  >
                    <Button.Icon>
                      <Icon name={TOOL_ICONS[format]} />
                    </Button.Icon>
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content size={toolSize} side="top">
                  {labels[format]} <Kbd>{shortcutText(format, apple)}</Kbd>
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </Tooltip.Provider>
      </div>
    </SurfaceDepthProvider>
  ) : null;

  return { onSelect: syncSelection, onKeyDown, anchorProps, toolbar };
}
