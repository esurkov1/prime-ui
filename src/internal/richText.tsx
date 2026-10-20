import * as React from "react";

import { cx } from "./cx";
import enterMotion from "./enterMotion.module.css";
import { HighlightMatch } from "./HighlightMatch";
import styles from "./richText.module.css";
import statusLoop from "./statusLoop.module.css";

/*
 * The chat's rich text as data: the Markdown subset the formatting toolbar writes
 * (`internal/textFormatting`) and the text + entities pair messengers send (Telegram, VK: offsets
 * in UTF-16 code units, the indices of a JS string). Both read into one tree of blocks and inline
 * nodes that `RichText` below renders; the tree writes back to either form.
 *
 * The subset: **bold** · _italic_ · __underline__ · ~~strike~~ · ||spoiler|| · `code` ·
 * ```fenced code``` (a language after the opening fence) · [label](url) · bare URLs · lines
 * starting with `> ` (a quote), `# ` to `###### ` (a heading line), `- ` / `* ` (a bulleted list
 * item) or `1. ` (a numbered one, numbered from its first item). A backslash before ASCII
 * punctuation writes it as text (`\*`, `\# `, `\- `, `3\. `). Links take http(s), mailto and tel
 * addresses and relative ones on the same origin (`/path`, `./`, `../`, `?query`, `#hash`);
 * anything else stays text.
 */

type RichInline =
  | { type: "text"; text: string }
  | { type: "bold" | "italic" | "underline" | "strike" | "spoiler"; children: RichInline[] }
  | { type: "code"; text: string }
  /** `auto` — a bare URL in the text, not a link the author made. */
  | { type: "link"; href: string; auto?: boolean; children: RichInline[] };

type RichBlock =
  | { type: "text"; children: RichInline[] }
  | { type: "quote"; children: RichInline[] }
  /** A heading line (`# `…): a bold line of the text's own type, not a heading of the page. */
  | { type: "heading"; children: RichInline[] }
  /** `marker` — `-` or `*` for a bulleted list, the first item's number for a numbered one. */
  | { type: "list"; marker: "-" | "*" | number; items: RichInline[][] }
  | { type: "code"; text: string; language?: string };

/** What a range of a message text is: its format, and the address of a `link`. */
export type TextEntityType =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "spoiler"
  | "code"
  | "pre"
  | "link"
  | "quote";

/** One formatted range of a plain text: `offset` and `length` in UTF-16 code units. */
export type TextEntity = {
  type: TextEntityType;
  offset: number;
  length: number;
  /** The address of a `link`; without it the range itself is the address. */
  url?: string;
  /** The language of a `pre` block. */
  language?: string;
};

/** A plain text with its formatted ranges: what a messenger sends and takes. */
export type FormattedText = { text: string; entities: TextEntity[] };

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** A relative address: a path from the root or from here, a query or a hash — never `//host`. */
const RELATIVE = /^(?:\/(?![/\\])|\.\.?\/|\?|#)/;
/** The origin a relative address is resolved against to prove it stays on the same origin. */
const RELATIVE_BASE = "https://relative.invalid";

/**
 * The address when it is a safe link, else `null`: an absolute http(s), `mailto:` or `tel:` one,
 * or a relative one that resolves on the same origin (`/\\host` and tab tricks do not).
 */
function safeHref(raw: string): string | null {
  const href = raw.trim();
  try {
    if (RELATIVE.test(href)) {
      return new URL(href, `${RELATIVE_BASE}/`).origin === RELATIVE_BASE ? href : null;
    }
    const url = new URL(href);
    return SAFE_PROTOCOLS.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

/** A safe address without a scheme: it stays in the product and opens in the same tab. */
const isRelativeHref = (href: string) => RELATIVE.test(href);

/** The address of bare URL text (`www.` reads as https). */
const bareHref = (text: string) => safeHref(text.startsWith("www.") ? `https://${text}` : text);

/** Trailing punctuation that ends a sentence rather than a bare URL. */
const URL_TAIL = /[.,;:!?)»"']+$/;
const BARE_URL = /(?:https?:\/\/|www\.)[^\s<]+/y;
const WORD = /[\p{L}\p{N}_]/u;
const ASCII_PUNCTUATION = /[!-/:-@[-`{-~]/;

/** A closer not escaped: not after an odd run of backslashes. */
const UNESCAPED = String.raw`(?<!(?<!\\)\\(?:\\\\)*)`;
/** A closer of `_` and `__` ends a word: no letter, digit or `_` after it. */
const WORD_END = String.raw`(?![\p{L}\p{N}_])`;

/** A node and how many characters of the source it consumes, or `null` when the match is not one. */
type RuleMatch = { node: RichInline; length: number } | null;

type Rule = {
  re: RegExp;
  /** Opens inside a word too; else only at a start, after a space or punctuation. */
  inWord: boolean;
  build: (match: RegExpExecArray) => RuleMatch;
};

const whole = (match: RegExpExecArray, node: RichInline): RuleMatch => ({
  node,
  length: match[0].length,
});

const wrap = (marker: string, wordEnd: boolean) =>
  new RegExp(
    `${marker}(?=\\S)([\\s\\S]+?)(?<=\\S)${UNESCAPED}${marker}${wordEnd ? WORD_END : ""}`,
    "uy",
  );

/*
 * `**`, `~~`, `||`, code and links open anywhere (`пол**ИНН**`); `_` and `__` only at a word's
 * edges, so `snake_case_name` stays text. Content never starts or ends with a space.
 */
const RULES: Rule[] = [
  { re: /`([^`\n]+)`/y, inWord: true, build: (m) => whole(m, { type: "code", text: m[1] }) },
  {
    re: /\[([^\]\n]+)\]\(([^)\s]+)\)/y,
    inWord: true,
    build: (m) => {
      const href = safeHref(m[2]);
      return href ? whole(m, { type: "link", href, children: parseInline(m[1]) }) : null;
    },
  },
  {
    re: wrap(String.raw`\*\*`, false),
    inWord: true,
    build: (m) => whole(m, { type: "bold", children: parseInline(m[1]) }),
  },
  {
    re: wrap(String.raw`\|\|`, false),
    inWord: true,
    build: (m) => whole(m, { type: "spoiler", children: parseInline(m[1]) }),
  },
  {
    re: wrap("~~", false),
    inWord: true,
    build: (m) => whole(m, { type: "strike", children: parseInline(m[1]) }),
  },
  {
    re: wrap("__", true),
    inWord: false,
    build: (m) => whole(m, { type: "underline", children: parseInline(m[1]) }),
  },
  {
    re: wrap("_", true),
    inWord: false,
    build: (m) => whole(m, { type: "italic", children: parseInline(m[1]) }),
  },
  {
    // A bare URL keeps the punctuation after it as text: it consumes only the address.
    re: BARE_URL,
    inWord: false,
    build: (m) => {
      const text = m[0].replace(URL_TAIL, "");
      const href = bareHref(text);
      return href
        ? {
            node: { type: "link", href, auto: true, children: [{ type: "text", text }] },
            length: text.length,
          }
        : null;
    },
  },
];

/** A marker may open here: at the start, or after a character that is not a letter or digit. */
const atWordEdge = (source: string, index: number) => index === 0 || !WORD.test(source[index - 1]);

/** Inline markup of one run of text. */
function parseInline(source: string): RichInline[] {
  const out: RichInline[] = [];
  let text = "";
  let index = 0;
  const flush = () => {
    if (text) out.push({ type: "text", text });
    text = "";
  };
  while (index < source.length) {
    if (source[index] === "\\" && ASCII_PUNCTUATION.test(source[index + 1] ?? "")) {
      text += source[index + 1];
      index += 2;
      continue;
    }
    let matched = false;
    const edge = atWordEdge(source, index);
    for (const rule of RULES) {
      if (!edge && !rule.inWord) continue;
      rule.re.lastIndex = index;
      const match = rule.re.exec(source);
      if (!match) continue;
      const built = rule.build(match);
      if (!built) continue;
      flush();
      out.push(built.node);
      index += built.length;
      matched = true;
      break;
    }
    if (!matched) {
      text += source[index];
      index += 1;
    }
  }
  flush();
  return out;
}

const FENCE = "```";

/** A heading line: one to six `#`, a space, the text. `#tag` without the space is text. */
const HEADING = /^#{1,6}[ \t]+(\S.*)$/;
/** A list item at the very start of a line: `- ` / `* ` or a number with a dot, then its text. */
const BULLET = /^([-*])[ \t]+(\S.*)$/;
const NUMBERED = /^(\d{1,9})\.[ \t]+(\S.*)$/;

type ListItem = { marker: "-" | "*" | number; text: string };

/** The list item a line is, or `null`. Numbered items continue each other whatever their numbers. */
function listItemOf(line: string): ListItem | null {
  const bullet = BULLET.exec(line);
  if (bullet) return { marker: bullet[1] as "-" | "*", text: bullet[2] };
  const numbered = NUMBERED.exec(line);
  return numbered ? { marker: Number(numbered[1]), text: numbered[2] } : null;
}

/** Items of one list: the same bullet, or both numbered. */
const sameList = (a: ListItem["marker"], b: ListItem["marker"]) =>
  a === b || (typeof a === "number" && typeof b === "number");

/**
 * Blocks of a Markdown source: runs of text, quotes (`> ` lines), heading lines, lists and fenced
 * code. Neighbouring blocks stand one line break apart in the source; the breaks around them stay
 * in the text. A blank line between two items of one list keeps the list whole.
 */
function parseRichText(source: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  type Run =
    | { type: "text" | "quote"; lines: string[] }
    | { type: "list"; marker: ListItem["marker"]; items: string[] };
  const state: { run: Run | null } = { run: null };
  const flush = () => {
    const { run } = state;
    if (run?.type === "list") {
      blocks.push({ type: "list", marker: run.marker, items: run.items.map(parseInline) });
    } else if (run) blocks.push({ type: run.type, children: parseInline(run.lines.join("\n")) });
    state.run = null;
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim().startsWith(FENCE)) {
      const end = lines.findIndex((next, j) => j > i && next.trim().startsWith(FENCE));
      if (end !== -1) {
        flush();
        const language = line.trim().slice(FENCE.length).trim();
        blocks.push({
          type: "code",
          text: lines.slice(i + 1, end).join("\n"),
          ...(language ? { language } : {}),
        });
        i = end;
        continue;
      }
    }
    const heading = HEADING.exec(line);
    if (heading) {
      flush();
      blocks.push({ type: "heading", children: parseInline(heading[1].trim()) });
      continue;
    }
    const item = listItemOf(line);
    if (item) {
      if (state.run?.type !== "list" || !sameList(state.run.marker, item.marker)) {
        flush();
        state.run = { type: "list", marker: item.marker, items: [] };
      }
      state.run.items.push(item.text.trimEnd());
      continue;
    }
    if (state.run?.type === "list" && line.trim() === "") {
      const next = lines.slice(i + 1).find((rest) => rest.trim() !== "");
      const nextItem = next === undefined ? null : listItemOf(next);
      if (nextItem && sameList(state.run.marker, nextItem.marker)) continue;
    }
    const quote = /^>\s?/.exec(line);
    const type = quote ? "quote" : "text";
    const content = quote ? line.slice(quote[0].length) : line;
    if (state.run?.type !== type) {
      flush();
      state.run = { type, lines: [] };
    }
    if (state.run?.type === type) state.run.lines.push(content);
  }
  flush();
  return blocks;
}

// ─── Entities → tree ─────────────────────────────────────────────────────────

type Range = TextEntity & { end: number };

const isBlockEntity = (entity: TextEntity) => entity.type === "pre" || entity.type === "quote";

/** Bare URLs of a plain run as links; the rest stays text. */
function linkify(text: string, start: number, end: number): RichInline[] {
  const out: RichInline[] = [];
  const bounded = text.slice(0, end);
  let cursor = start;
  for (let index = start; index < end; index += 1) {
    if (!atWordEdge(text, index)) continue;
    BARE_URL.lastIndex = index;
    const match = BARE_URL.exec(bounded);
    if (!match) continue;
    const url = match[0].replace(URL_TAIL, "");
    const href = bareHref(url);
    if (!href) continue;
    if (index > cursor) out.push({ type: "text", text: text.slice(cursor, index) });
    out.push({ type: "link", href, auto: true, children: [{ type: "text", text: url }] });
    cursor = index + url.length;
    index = cursor - 1;
  }
  if (end > cursor) out.push({ type: "text", text: text.slice(cursor, end) });
  return out;
}

const byStart = (a: Range, b: Range) => a.offset - b.offset || b.end - a.end;

const EMPHASIS: Partial<
  Record<TextEntityType, "bold" | "italic" | "underline" | "strike" | "spoiler">
> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "strike",
  spoiler: "spoiler",
};

/**
 * Inline nodes of `text` between `start` and `end` from the ranges inside it: a range is the parent
 * of the ones it holds; one that crosses its end is cut there and goes on after it.
 */
function inlineFromRanges(
  text: string,
  ranges: Range[],
  start: number,
  end: number,
  inLink: boolean,
): RichInline[] {
  const out: RichInline[] = [];
  const plain = (from: number, to: number) => {
    if (to <= from) return;
    if (inLink) out.push({ type: "text", text: text.slice(from, to) });
    else out.push(...linkify(text, from, to));
  };
  const queue = [...ranges].sort(byStart);
  let cursor = start;
  while (queue.length > 0) {
    const range = queue.shift() as Range;
    const inner: Range[] = [];
    const rest: Range[] = [];
    for (const other of queue) {
      if (other.offset >= range.end) rest.push(other);
      else if (other.end <= range.end) inner.push(other);
      else {
        inner.push({ ...other, end: range.end });
        rest.push({ ...other, offset: range.end });
      }
    }
    queue.splice(0, queue.length, ...rest.sort(byStart));
    plain(cursor, range.offset);
    cursor = range.end;
    const slice = text.slice(range.offset, range.end);
    const emphasis = EMPHASIS[range.type];
    if (range.type === "code") {
      out.push({ type: "code", text: slice });
    } else if (emphasis) {
      out.push({
        type: emphasis,
        children: inlineFromRanges(text, inner, range.offset, range.end, inLink),
      });
    } else if (range.type === "link" && !inLink) {
      const href = range.url ? safeHref(range.url) : bareHref(slice.trim());
      const children = inlineFromRanges(text, inner, range.offset, range.end, true);
      if (href) out.push({ type: "link", href, ...(range.url ? {} : { auto: true }), children });
      else out.push(...children);
    } else {
      // An unknown type, or a link inside a link: its text, with what it holds.
      out.push(...inlineFromRanges(text, inner, range.offset, range.end, inLink));
    }
  }
  plain(cursor, end);
  // Neighbouring runs of text (a range that turned out plain) are one.
  return out.reduce<RichInline[]>((merged, node) => {
    const last = merged[merged.length - 1];
    if (node.type === "text" && last?.type === "text") {
      merged[merged.length - 1] = { type: "text", text: last.text + node.text };
    } else merged.push(node);
    return merged;
  }, []);
}

/** The ranges of `entities` that fall inside `text`, clipped to it; empty ones dropped. */
function rangesOf(text: string, entities: readonly TextEntity[]): Range[] {
  const out: Range[] = [];
  for (const entity of entities) {
    if (!Number.isFinite(entity.offset) || !Number.isFinite(entity.length)) continue;
    const offset = Math.max(0, Math.min(text.length, Math.trunc(entity.offset)));
    const end = Math.max(offset, Math.min(text.length, Math.trunc(entity.offset + entity.length)));
    if (end > offset) out.push({ ...entity, offset, end });
  }
  return out.sort(byStart);
}

/**
 * The tree of a plain text and its entities: `pre` and `quote` ranges become blocks (the line
 * breaks at their edges are the blocks' own), the rest inline nodes; bare URLs in plain runs are
 * links. Overlapping blocks keep the first; an unknown type shows its text.
 */
function blocksFromEntities(text: string, entities: readonly TextEntity[]): RichBlock[] {
  const source = text.replace(/\r\n?/g, "\n");
  const ranges = rangesOf(source, entities);
  const blockRanges: Range[] = [];
  for (const range of ranges.filter(isBlockEntity)) {
    let { offset, end } = range;
    while (offset < end && source[offset] === "\n") offset += 1;
    while (end > offset && source[end - 1] === "\n") end -= 1;
    const last = blockRanges[blockRanges.length - 1];
    if (end > offset && (!last || offset >= last.end)) blockRanges.push({ ...range, offset, end });
  }
  const inline = ranges.filter((range) => !isBlockEntity(range));
  const inlineIn = (start: number, end: number) =>
    inline
      .filter((range) => range.offset < end && range.end > start)
      .map((range) => ({
        ...range,
        offset: Math.max(start, range.offset),
        end: Math.min(end, range.end),
      }));

  const blocks: RichBlock[] = [];
  const pushText = (from: number, to: number, afterBlock: boolean, beforeBlock: boolean) => {
    let start = from;
    let end = to;
    if (afterBlock && source[start] === "\n") start += 1;
    if (beforeBlock && end > start && source[end - 1] === "\n") end -= 1;
    if (end <= start) return;
    blocks.push({
      type: "text",
      children: inlineFromRanges(source, inlineIn(start, end), start, end, false),
    });
  };
  let cursor = 0;
  blockRanges.forEach((range, index) => {
    pushText(cursor, range.offset, index > 0, true);
    if (range.type === "pre") {
      blocks.push({
        type: "code",
        text: source.slice(range.offset, range.end),
        ...(range.language ? { language: range.language } : {}),
      });
    } else {
      blocks.push({
        type: "quote",
        children: inlineFromRanges(
          source,
          inlineIn(range.offset, range.end),
          range.offset,
          range.end,
          false,
        ),
      });
    }
    cursor = range.end;
  });
  pushText(cursor, source.length, blockRanges.length > 0, false);
  return blocks;
}

// ─── Tree → entities ─────────────────────────────────────────────────────────

const ENTITY_OF = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strike: "strikethrough",
  spoiler: "spoiler",
} as const;

/** The marker a list item is written with: its bullet, or its number counted from the first. */
const itemMarker = (marker: "-" | "*" | number, index: number) =>
  typeof marker === "number" ? `${marker + index}.` : marker;

/**
 * The plain text of the tree and its entities; bare URLs make none (a messenger links them). A
 * messenger has no headings or lists: a heading line is its text in bold, a list item keeps its
 * marker as text (`- `, `3. `).
 */
function entitiesOf(blocks: RichBlock[]): FormattedText {
  let text = "";
  const entities: TextEntity[] = [];
  const add = (entity: TextEntity) => {
    if (entity.length > 0) entities.push(entity);
  };
  const walk = (nodes: RichInline[]) => {
    for (const node of nodes) {
      const offset = text.length;
      if (node.type === "text") {
        text += node.text;
      } else if (node.type === "code") {
        text += node.text;
        add({ type: "code", offset, length: node.text.length });
      } else if (node.type === "link") {
        walk(node.children);
        if (!node.auto) add({ type: "link", offset, length: text.length - offset, url: node.href });
      } else {
        walk(node.children);
        add({ type: ENTITY_OF[node.type], offset, length: text.length - offset });
      }
    }
  };
  blocks.forEach((block, index) => {
    if (index > 0) text += "\n";
    const offset = text.length;
    if (block.type === "code") {
      text += block.text;
      add({
        type: "pre",
        offset,
        length: block.text.length,
        ...(block.language ? { language: block.language } : {}),
      });
    } else if (block.type === "list") {
      block.items.forEach((item, itemIndex) => {
        if (itemIndex > 0) text += "\n";
        text += `${itemMarker(block.marker, itemIndex)} `;
        walk(item);
      });
    } else {
      walk(block.children);
      if (block.type === "quote") add({ type: "quote", offset, length: text.length - offset });
      if (block.type === "heading") add({ type: "bold", offset, length: text.length - offset });
    }
  });
  entities.sort(
    (a, b) => a.offset - b.offset || b.length - a.length || a.type.localeCompare(b.type),
  );
  return { text, entities };
}

/**
 * The plain text and entities of a Markdown source — what a messenger takes: Composer writes
 * Markdown, the messenger's API wants `{ text, entities }`.
 */
export function getTextEntities(source: string): FormattedText {
  return entitiesOf(parseRichText(source));
}

// ─── Tree → Markdown ─────────────────────────────────────────────────────────

const MARKERS = {
  bold: "**",
  italic: "_",
  underline: "__",
  strike: "~~",
  spoiler: "||",
} as const;

const MARKUP_CHARS = /[\\`*_~|[\]]/g;
const URLS = /(?:https?:\/\/|www\.)[^\s<]+/g;

/**
 * Every markup character of `text` escaped, except what never reads as markup: bare URLs (they link
 * as written) and `_` inside a word (`snake_case`).
 */
function escapeAll(text: string): string {
  const escapePart = (part: string, from: number) =>
    part.replace(MARKUP_CHARS, (char, index: number) => {
      const at = from + index;
      const inWord = char === "_" && WORD.test(text[at - 1] ?? "") && WORD.test(text[at + 1] ?? "");
      return inWord ? char : `\\${char}`;
    });
  let out = "";
  let cursor = 0;
  for (const match of text.matchAll(URLS)) {
    out += escapePart(text.slice(cursor, match.index), cursor);
    out += match[0];
    cursor = match.index + match[0].length;
  }
  return out + escapePart(text.slice(cursor), cursor);
}

/** `text` as a Markdown text run: as is when the parser reads it back unchanged, else escaped. */
function escapeText(text: string, always: boolean): string {
  if (!text) return text;
  if (!always) {
    const parsed = parseInline(text);
    if (parsed.length === 1 && parsed[0].type === "text" && parsed[0].text === text) return text;
    if (parsed.every((node) => node.type === "text" || (node.type === "link" && node.auto))) {
      // Only bare URLs: they read back as the same text.
      if (parsed.map((node) => plainOf([node])).join("") === text) return text;
    }
  }
  return escapeAll(text);
}

function plainOf(nodes: RichInline[]): string {
  return nodes
    .map((node) =>
      node.type === "text" || node.type === "code" ? node.text : plainOf(node.children),
    )
    .join("");
}

/** Markdown of inline nodes; `plain` is the whole run, so a marker sees the letters around it. */
function inlineMarkdown(nodes: RichInline[], plain: string, always: boolean): string {
  let at = 0;
  const write = (list: RichInline[]): string => {
    let out = "";
    for (const node of list) {
      const start = at;
      if (node.type === "text") {
        at += node.text.length;
        out += escapeText(node.text, always);
        continue;
      }
      if (node.type === "code") {
        at += node.text.length;
        out += /[`\n]/.test(node.text) ? escapeAll(node.text) : `\`${node.text}\``;
        continue;
      }
      const inner = write(node.children);
      const label = plain.slice(start, at);
      if (node.type === "link") {
        const writable = !node.auto && !/[\]\n]/.test(label) && !/[\s)]/.test(node.href);
        out += writable && label.trim() ? `[${inner}](${node.href})` : inner;
        continue;
      }
      const lead = /^\s*/.exec(inner)?.[0] ?? "";
      const trail = /\s*$/.exec(inner.slice(lead.length))?.[0] ?? "";
      const core = inner.slice(lead.length, inner.length - trail.length);
      const marker = MARKERS[node.type];
      // `_` and `__` open and close only at a word's edges: inside a word the format is lost.
      const coreStart = start + lead.length;
      const coreEnd = at - trail.length;
      const inWord =
        marker.startsWith("_") &&
        (WORD.test(plain[coreStart - 1] ?? "") || WORD.test(plain[coreEnd] ?? ""));
      out += core && !inWord ? `${lead}${marker}${core}${marker}${trail}` : inner;
    }
    return out;
  };
  return write(nodes);
}

/** A heading or list marker at a line's start, up to the character a backslash escapes. */
const LINE_MARKER = /^(?:#(?=#{0,5}[ \t]+\S)|[-*](?=[ \t]+\S)|\d{1,9}(?=\.[ \t]+\S))/;

/**
 * A text line that the block parser would read as a quote, a fence, a heading or a list item is
 * escaped (`\>`, `\#`, `\-`, `3\.`).
 */
const escapeLineStarts = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) =>
      line
        .replace(/^>|^(\s*)(?=```)/, (found, space = "") => `${space}\\${found.trimStart()}`)
        .replace(LINE_MARKER, (found) => (/^\d/.test(found) ? `${found}\\` : `\\${found}`)),
    )
    .join("\n");

function toMarkdown(blocks: RichBlock[], always: boolean): string {
  return blocks
    .map((block) => {
      if (block.type === "code") {
        if (block.text.split("\n").some((line) => line.trim().startsWith(FENCE))) {
          return escapeLineStarts(escapeAll(block.text));
        }
        return `${FENCE}${block.language ?? ""}\n${block.text}\n${FENCE}`;
      }
      if (block.type === "list") {
        return block.items
          .map(
            (item, index) =>
              `${itemMarker(block.marker, index)} ${inlineMarkdown(item, plainOf(item), always)}`,
          )
          .join("\n");
      }
      const markdown = inlineMarkdown(block.children, plainOf(block.children), always);
      if (block.type === "heading") return `# ${markdown}`;
      if (block.type === "text") return escapeLineStarts(markdown);
      return markdown
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    })
    .join("\n");
}

const sameText = (a: FormattedText, b: FormattedText) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The Markdown source of a plain text and its entities — to edit a received or stored text in
 * Composer or a formatting Textarea. Text that would read as markup is escaped (`\*`); a format
 * the subset cannot hold (`_italic_` inside a word) is dropped, its text kept.
 */
export function getRichTextSource({ text, entities }: FormattedText): string {
  const blocks = blocksFromEntities(text, entities);
  const target = entitiesOf(blocks);
  const light = toMarkdown(blocks, false);
  if (sameText(getTextEntities(light), target)) return light;
  return toMarkdown(blocks, true);
}

// ─── Rendering ───────────────────────────────────────────────────────────────

/*
 * The tree rendered as React elements — never as HTML, so a message cannot inject markup.
 */

/** Line breaks around a quote or a code block are the block's own spacing; empty runs go. */
function trimBlocks(blocks: RichBlock[]): RichBlock[] {
  return blocks.flatMap((block, index): RichBlock[] => {
    if (block.type !== "text") return [block];
    const trimmed = trimBreaks(block.children, index > 0, index < blocks.length - 1);
    return trimmed.length > 0 ? [{ type: "text", children: trimmed }] : [];
  });
}

function trimBreaks(nodes: RichInline[], start: boolean, end: boolean): RichInline[] {
  const out = [...nodes];
  const first = out[0];
  if (start && first?.type === "text") out[0] = { ...first, text: first.text.replace(/^\n+/, "") };
  const last = out[out.length - 1];
  if (end && last?.type === "text") {
    out[out.length - 1] = { ...last, text: last.text.replace(/\n+$/, "") };
  }
  return out.filter((node) => node.type !== "text" || node.text !== "");
}

type RichTextLabels = {
  /** Accessible name of a masked spoiler: its text is not read until it is revealed. */
  spoiler: string;
};

/**
 * A press on a link of the text, with its address: `event.preventDefault()` keeps the browser from
 * following it (the app routes a relative address itself). A modified press (a button other than
 * the main one, ⌘, Ctrl, Shift, Alt) is the browser's: a new tab or window, no call.
 */
export type RichTextLinkClick = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;

/** What every inline node of one text renders with. */
type InlineContext = { labels: RichTextLabels; onLinkClick?: RichTextLinkClick };

/**
 * A `||spoiler||`: a button named «Скрытый текст» over a masked run until it is pressed (click,
 * Enter, Space), then the run itself (its links work); a keyboard press moves the focus onto it, so
 * a screen reader goes on from the text. One way, like a chat: a revealed spoiler stays revealed.
 */
function Spoiler({
  nodes,
  highlight,
  context,
}: {
  nodes: RichInline[];
  highlight: string;
  context: InlineContext;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const moveFocus = React.useRef(false);
  React.useLayoutEffect(() => {
    if (revealed && moveFocus.current) textRef.current?.focus();
  }, [revealed]);
  if (revealed) {
    return (
      <span
        ref={textRef}
        className={cx(styles.spoiler, enterMotion.enterFade)}
        data-state="revealed"
        tabIndex={-1}
      >
        {renderInline(nodes, highlight, context)}
      </span>
    );
  }
  const reveal = (event: React.SyntheticEvent<HTMLSpanElement>) => {
    moveFocus.current = event.currentTarget === document.activeElement;
    setRevealed(true);
  };
  return (
    // biome-ignore lint/a11y/useSemanticElements: a <button> is an inline block; a spoiler wraps with the line like the text around it
    <span
      role="button"
      tabIndex={0}
      className={cx(styles.spoiler, statusLoop.glint)}
      data-state="masked"
      aria-label={context.labels.spoiler}
      onClick={reveal}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        reveal(event);
      }}
    >
      {/* Out of the accessibility tree until revealed; no search marks or links under the mask. */}
      <span aria-hidden="true">{renderInline(nodes, "", context, true)}</span>
    </span>
  );
}

/** A press the browser keeps for itself: another button or a modifier (a new tab or window). */
const isModifiedClick = (event: React.MouseEvent) =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

function renderInline(
  nodes: RichInline[],
  highlight: string,
  context: InlineContext,
  masked = false,
): React.ReactNode[] {
  const mark = (text: string) =>
    highlight ? <HighlightMatch text={text} query={highlight} all /> : text;
  return nodes.map((node, index) => {
    const key = index;
    switch (node.type) {
      case "text":
        return <React.Fragment key={key}>{mark(node.text)}</React.Fragment>;
      case "bold":
        return <strong key={key}>{renderInline(node.children, highlight, context, masked)}</strong>;
      case "italic":
        return <em key={key}>{renderInline(node.children, highlight, context, masked)}</em>;
      case "underline":
        return <u key={key}>{renderInline(node.children, highlight, context, masked)}</u>;
      case "strike":
        return <s key={key}>{renderInline(node.children, highlight, context, masked)}</s>;
      case "spoiler":
        // Inside a masked spoiler a nested one is masked text too (never a button in a button).
        return masked ? (
          <React.Fragment key={key}>
            {renderInline(node.children, "", context, true)}
          </React.Fragment>
        ) : (
          <Spoiler key={key} nodes={node.children} highlight={highlight} context={context} />
        );
      case "code":
        return (
          <code key={key} className={styles.code}>
            {mark(node.text)}
          </code>
        );
      default: {
        if (masked) {
          return (
            <React.Fragment key={key}>
              {renderInline(node.children, "", context, true)}
            </React.Fragment>
          );
        }
        const { onLinkClick } = context;
        const href = node.href;
        // A relative address stays in the product: the same tab. An absolute one opens a new tab.
        const leaves = !isRelativeHref(href);
        // A link. Not LinkButton: that is an inline-flex control, a link in running text wraps with the line.
        return (
          <a
            key={key}
            className={styles.link}
            href={href}
            target={leaves ? "_blank" : undefined}
            rel={leaves ? "noopener noreferrer" : undefined}
            onClick={
              onLinkClick
                ? (event) => {
                    if (!isModifiedClick(event)) onLinkClick(href, event);
                  }
                : undefined
            }
          >
            {renderInline(node.children, highlight, context, masked)}
          </a>
        );
      }
    }
  });
}

type RichTextProps = {
  /** The Markdown source, or the plain text that `entities` format. */
  source: string;
  /** Formatted ranges of `source`: it is then plain text, never read as Markdown. */
  entities?: readonly TextEntity[];
  /** Rendered at the very end of the last line (a chat bubble's meta reserve). */
  end?: React.ReactNode;
  /** Marks every case-insensitive match of this text (a search through a chat). */
  highlight?: string;
  /** The host's strings (`Message.Text` passes its `spoiler`). */
  labels: RichTextLabels;
  /** A press on a link (the app routes a relative one). */
  onLinkClick?: RichTextLinkClick;
};

/**
 * A message text with its Markdown subset rendered safely; `end` closes the last text line (the
 * last list item's, after a list). A heading line is a `<p>` holding a `<strong>`: a message is
 * not a section of the page, so it adds nothing to the page's outline of headings.
 */
export function RichText({
  source,
  entities,
  end,
  highlight = "",
  labels,
  onLinkClick,
}: RichTextProps) {
  const query = highlight.trim();
  // Parsed once per text: a message re-renders on its hover, menu and reaction state.
  const blocks = React.useMemo(
    () => trimBlocks(entities ? blocksFromEntities(source, entities) : parseRichText(source)),
    [source, entities],
  );
  const context = React.useMemo(() => ({ labels, onLinkClick }), [labels, onLinkClick]);
  const last = blocks[blocks.length - 1];
  const endsInText = last !== undefined && last.type !== "code";
  return (
    <>
      {blocks.map((block, index) => {
        const tail = index === blocks.length - 1 && endsInText ? end : null;
        const key = index;
        if (block.type === "code") {
          return (
            <pre key={key} className={styles.pre}>
              <code>
                {query ? <HighlightMatch text={block.text} query={query} all /> : block.text}
              </code>
            </pre>
          );
        }
        if (block.type === "list") {
          const { marker } = block;
          const items = block.items.map((item, itemIndex) => {
            const itemKey = itemIndex;
            return (
              <li key={itemKey} className={styles.item}>
                {renderInline(item, query, context)}
                {itemIndex === block.items.length - 1 ? tail : null}
              </li>
            );
          });
          return typeof marker === "number" ? (
            <ol key={key} className={styles.list} start={marker === 1 ? undefined : marker}>
              {items}
            </ol>
          ) : (
            <ul key={key} className={styles.list}>
              {items}
            </ul>
          );
        }
        if (block.type === "heading") {
          return (
            <p key={key} className={styles.heading}>
              <strong>{renderInline(block.children, query, context)}</strong>
              {tail}
            </p>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={key} className={styles.quote}>
              {renderInline(block.children, query, context)}
              {tail}
            </blockquote>
          );
        }
        return (
          <p key={key} className={styles.paragraph}>
            {renderInline(block.children, query, context)}
            {tail}
          </p>
        );
      })}
      {endsInText || end == null ? null : <p className={styles.paragraph}>{end}</p>}
    </>
  );
}
