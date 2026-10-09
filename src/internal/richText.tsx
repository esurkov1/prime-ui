import * as React from "react";

import { HighlightMatch } from "./HighlightMatch";
import styles from "./richText.module.css";

/*
 * The Markdown subset the Composer writes (`src/components/composer/format.ts`), rendered as React
 * elements — never as HTML, so a message cannot inject markup:
 *   **bold** · _italic_ · ~~strike~~ · `code` · ```fenced code``` · [label](url) · bare URLs ·
 *   lines starting with `> ` (a quote). Line breaks are kept.
 * Links take only http(s), mailto and tel addresses; anything else stays text.
 */

export type RichInline =
  | { type: "text"; text: string }
  | { type: "bold" | "italic" | "strike"; children: RichInline[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: RichInline[] };

export type RichBlock =
  | { type: "text"; children: RichInline[] }
  | { type: "quote"; children: RichInline[] }
  | { type: "code"; text: string };

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** The address when it is a safe link, else `null`. */
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  try {
    const url = new URL(href);
    return SAFE_PROTOCOLS.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

/** Trailing punctuation that ends a sentence rather than a bare URL. */
const URL_TAIL = /[.,;:!?)»"']+$/;

type Rule = {
  re: RegExp;
  build: (match: RegExpExecArray) => RichInline | null;
};

/*
 * Emphasis markers open after a start, a space or punctuation and close before an end, a space or
 * punctuation, so `snake_case_name` and `2*3*4` stay text.
 */
const RULES: Rule[] = [
  { re: /`([^`\n]+)`/y, build: (m) => ({ type: "code", text: m[1] }) },
  {
    re: /\[([^\]\n]+)\]\(([^)\s]+)\)/y,
    build: (m) => {
      const href = safeHref(m[2]);
      return href ? { type: "link", href, children: parseInline(m[1]) } : null;
    },
  },
  {
    re: /\*\*(?=\S)([\s\S]+?)(?<=\S)\*\*/y,
    build: (m) => ({ type: "bold", children: parseInline(m[1]) }),
  },
  {
    re: /~~(?=\S)([\s\S]+?)(?<=\S)~~/y,
    build: (m) => ({ type: "strike", children: parseInline(m[1]) }),
  },
  {
    re: /_(?=\S)([\s\S]+?)(?<=\S)_(?![\p{L}\p{N}_])/uy,
    build: (m) => ({ type: "italic", children: parseInline(m[1]) }),
  },
  {
    re: /(?:https?:\/\/|www\.)[^\s<]+/y,
    build: (m) => {
      const text = m[0].replace(URL_TAIL, "");
      const href = safeHref(text.startsWith("www.") ? `https://${text}` : text);
      return href ? { type: "link", href, children: [{ type: "text", text }] } : null;
    },
  },
];

/** A marker may open here: at the start, or after a character that is not a letter or digit. */
function canOpen(source: string, index: number): boolean {
  if (index === 0) return true;
  return !/[\p{L}\p{N}_]/u.test(source[index - 1]);
}

/** Inline markup of one run of text. */
export function parseInline(source: string): RichInline[] {
  const out: RichInline[] = [];
  let text = "";
  let index = 0;
  const flush = () => {
    if (text) out.push({ type: "text", text });
    text = "";
  };
  while (index < source.length) {
    let matched = false;
    if (canOpen(source, index) || source[index] === "`") {
      for (const rule of RULES) {
        rule.re.lastIndex = index;
        const match = rule.re.exec(source);
        if (!match) continue;
        const node = rule.build(match);
        if (!node) continue;
        // A bare URL keeps the punctuation after it as text.
        const length =
          node.type === "link" && rule === RULES[RULES.length - 1]
            ? (node.children[0] as { text: string }).text.length
            : match[0].length;
        flush();
        out.push(node);
        index += length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      text += source[index];
      index += 1;
    }
  }
  flush();
  return out;
}

/** Blocks of a message: runs of text, quotes (`> ` lines) and fenced code. */
export function parseRichText(source: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  type Run = { type: "text" | "quote"; lines: string[] };
  const state: { run: Run | null } = { run: null };
  const flush = () => {
    const { run } = state;
    if (run) blocks.push({ type: run.type, children: parseInline(run.lines.join("\n")) });
    state.run = null;
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const end = lines.findIndex((next, j) => j > i && next.trim().startsWith("```"));
      if (end !== -1) {
        flush();
        blocks.push({ type: "code", text: lines.slice(i + 1, end).join("\n") });
        i = end;
        continue;
      }
    }
    const quote = /^>\s?/.exec(line);
    const type = quote ? "quote" : "text";
    const content = quote ? line.slice(quote[0].length) : line;
    if (state.run?.type !== type) {
      flush();
      state.run = { type, lines: [] };
    }
    state.run?.lines.push(content);
  }
  flush();
  // Blank lines around a quote or a code block are the block's own spacing.
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

function renderInline(nodes: RichInline[], highlight: string): React.ReactNode[] {
  const mark = (text: string) =>
    highlight ? <HighlightMatch text={text} query={highlight} all /> : text;
  return nodes.map((node, index) => {
    const key = index;
    switch (node.type) {
      case "text":
        return <React.Fragment key={key}>{mark(node.text)}</React.Fragment>;
      case "bold":
        return <strong key={key}>{renderInline(node.children, highlight)}</strong>;
      case "italic":
        return <em key={key}>{renderInline(node.children, highlight)}</em>;
      case "strike":
        return <s key={key}>{renderInline(node.children, highlight)}</s>;
      case "code":
        return (
          <code key={key} className={styles.code}>
            {mark(node.text)}
          </code>
        );
      default:
        // A link. Not LinkButton: that is an inline-flex control, a link in running text wraps with the line.
        return (
          <a
            key={key}
            className={styles.link}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {renderInline(node.children, highlight)}
          </a>
        );
    }
  });
}

export type RichTextProps = {
  source: string;
  /** Rendered at the very end of the last line (a chat bubble's meta reserve). */
  end?: React.ReactNode;
  /** Marks every case-insensitive match of this text (a search through a chat). */
  highlight?: string;
};

/** A message text with its Markdown subset rendered safely; `end` closes the last text line. */
export function RichText({ source, end, highlight = "" }: RichTextProps) {
  const query = highlight.trim();
  // Parsed once per text: a message re-renders on its hover, menu and reaction state.
  const blocks = React.useMemo(() => parseRichText(source), [source]);
  const last = blocks[blocks.length - 1];
  const endsInText = last?.type === "text" || last?.type === "quote";
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
        if (block.type === "quote") {
          return (
            <blockquote key={key} className={styles.quote}>
              {renderInline(block.children, query)}
              {tail}
            </blockquote>
          );
        }
        return (
          <p key={key} className={styles.paragraph}>
            {renderInline(block.children, query)}
            {tail}
          </p>
        );
      })}
      {endsInText || end == null ? null : <p className={styles.paragraph}>{end}</p>}
    </>
  );
}
