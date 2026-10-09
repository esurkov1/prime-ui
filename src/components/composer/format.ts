/**
 * Markdown formatting of a plain-text message (the Composer's toolbar and hotkeys): pure functions
 * over the text and its selection, so the component only applies the result to its textarea.
 */

/** A formatting command: what the toolbar button or the hotkey applies to the selection. */
export type ComposerFormat = "bold" | "italic" | "strikethrough" | "code" | "link" | "quote";

/** Text with its selection, `start <= end` (a caret when equal). */
export type TextSelection = { text: string; start: number; end: number };

const MARKERS: Record<"bold" | "italic" | "strikethrough" | "code", string> = {
  bold: "**",
  italic: "_",
  strikethrough: "~~",
  code: "`",
};

const FENCE = "```";
const QUOTE = "> ";
const LINK_PLACEHOLDER = "https://";

/** Wraps the selection in `marker`, or unwraps it when it is already wrapped (inside or around). */
function toggleWrap({ text, start, end }: TextSelection, marker: string): TextSelection {
  const m = marker.length;
  const selected = text.slice(start, end);
  // Markers just outside the selection: `**[word]**`.
  if (text.slice(start - m, start) === marker && text.slice(end, end + m) === marker) {
    return {
      text: text.slice(0, start - m) + selected + text.slice(end + m),
      start: start - m,
      end: end - m,
    };
  }
  // Markers inside the selection: `[**word**]`.
  if (selected.length >= m * 2 && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(m, selected.length - m);
    return {
      text: text.slice(0, start) + inner + text.slice(end),
      start,
      end: start + inner.length,
    };
  }
  return {
    text: text.slice(0, start) + marker + selected + marker + text.slice(end),
    start: start + m,
    end: end + m,
  };
}

/** A fenced block around a multi-line selection, on lines of its own. */
function fenceBlock({ text, start, end }: TextSelection): TextSelection {
  const selected = text.slice(start, end);
  const before = start > 0 && text[start - 1] !== "\n" ? "\n" : "";
  const after = end < text.length && text[end] !== "\n" ? "\n" : "";
  const open = `${before}${FENCE}\n`;
  return {
    text: `${text.slice(0, start)}${open}${selected}\n${FENCE}${after}${text.slice(end)}`,
    start: start + open.length,
    end: start + open.length + selected.length,
  };
}

/** `[label](url)`: the URL part is selected, so typing or pasting replaces it. */
function insertLink({ text, start, end }: TextSelection): TextSelection {
  const selected = text.slice(start, end);
  const isUrl = /^https?:\/\/\S+$/.test(selected);
  if (isUrl) {
    // The selection is the address: the empty label takes the caret.
    const inserted = `[](${selected})`;
    return {
      text: text.slice(0, start) + inserted + text.slice(end),
      start: start + 1,
      end: start + 1,
    };
  }
  const inserted = `[${selected}](${LINK_PLACEHOLDER})`;
  const urlStart = start + selected.length + 3;
  return {
    text: text.slice(0, start) + inserted + text.slice(end),
    start: urlStart,
    end: urlStart + LINK_PLACEHOLDER.length,
  };
}

/** `> ` before every line the selection touches; removed when every one already has it. */
function toggleQuote({ text, start, end }: TextSelection): TextSelection {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = text.indexOf("\n", end > start && text[end - 1] === "\n" ? end - 1 : end);
  const lineEnd = nextBreak === -1 ? text.length : nextBreak;
  const lines = text.slice(lineStart, lineEnd).split("\n");
  const quoted = lines.every((line) => line.startsWith(QUOTE));
  const next = lines.map((line) => (quoted ? line.slice(QUOTE.length) : QUOTE + line));
  const block = next.join("\n");
  const delta = quoted ? -QUOTE.length : QUOTE.length;
  return {
    text: text.slice(0, lineStart) + block + text.slice(lineEnd),
    start: Math.max(lineStart, start + delta),
    end: Math.max(lineStart, end + delta * lines.length),
  };
}

/** The text and selection after `format` is applied to the selection. */
export function applyFormat(selection: TextSelection, format: ComposerFormat): TextSelection {
  switch (format) {
    case "link":
      return insertLink(selection);
    case "quote":
      return toggleQuote(selection);
    case "code": {
      const selected = selection.text.slice(selection.start, selection.end);
      return selected.includes("\n") ? fenceBlock(selection) : toggleWrap(selection, MARKERS.code);
    }
    default:
      return toggleWrap(selection, MARKERS[format]);
  }
}

/**
 * The one span that differs between two texts (common prefix and suffix removed), so the change can
 * be typed into the textarea as one edit and stay on its undo stack.
 */
export function diffRange(
  before: string,
  after: string,
): { start: number; end: number; insert: string } {
  let start = 0;
  const max = Math.min(before.length, after.length);
  while (start < max && before[start] === after[start]) start += 1;
  let tail = 0;
  while (
    tail < max - start &&
    before[before.length - 1 - tail] === after[after.length - 1 - tail]
  ) {
    tail += 1;
  }
  return {
    start,
    end: before.length - tail,
    insert: after.slice(start, after.length - tail),
  };
}

/** The format a key press asks for: Mod+B · Mod+I · Mod+Shift+X · Mod+E · Mod+K · Mod+Shift+9. */
export function formatForKey(event: {
  key: string;
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): ComposerFormat | null {
  if (!(event.metaKey || event.ctrlKey) || event.altKey) return null;
  // `code` is the physical key: the shortcut works on any layout (Russian «и» is KeyB).
  const shift = event.shiftKey;
  switch (event.code) {
    case "KeyB":
      return shift ? null : "bold";
    case "KeyI":
      return shift ? null : "italic";
    case "KeyX":
      return shift ? "strikethrough" : null;
    case "KeyE":
      return shift ? null : "code";
    case "KeyK":
      return shift ? null : "link";
    case "Digit9":
      return shift ? "quote" : null;
    default:
      return null;
  }
}

/** Shortcut of every format, by modifier names: rendered as `⌘B` on Apple systems, `Ctrl+B` elsewhere. */
export const FORMAT_SHORTCUTS: Record<ComposerFormat, { shift: boolean; key: string }> = {
  bold: { shift: false, key: "B" },
  italic: { shift: false, key: "I" },
  strikethrough: { shift: true, key: "X" },
  code: { shift: false, key: "E" },
  link: { shift: false, key: "K" },
  quote: { shift: true, key: "9" },
};

/** `⌘⇧X` on Apple systems, `Ctrl+Shift+X` elsewhere. */
export function shortcutText(format: ComposerFormat, apple: boolean): string {
  const { shift, key } = FORMAT_SHORTCUTS[format];
  if (apple) return `⌘${shift ? "⇧" : ""}${key}`;
  return `Ctrl+${shift ? "Shift+" : ""}${key}`;
}
