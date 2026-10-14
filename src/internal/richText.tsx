import * as React from "react";

import { HighlightMatch } from "./HighlightMatch";
import { useLabels } from "./labels";
import styles from "./richText.module.css";

/*
 * The Markdown subset the formatting toolbar writes (`internal/textFormatting`), rendered as React
 * elements — never as HTML, so a message cannot inject markup:
 *   **bold** · _italic_ · ~~strike~~ · ||spoiler|| · `code` · ```fenced code``` · [label](url) ·
 *   bare URLs · lines starting with `> ` (a quote). Line breaks are kept.
 * Links take only http(s), mailto and tel addresses; anything else stays text.
 */

export type RichInline =
  | { type: "text"; text: string }
  | { type: "bold" | "italic" | "strike" | "spoiler"; children: RichInline[] }
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

/** A node and how many characters of the source it consumes, or `null` when the match is not one. */
type RuleMatch = { node: RichInline; length: number } | null;

type Rule = {
  re: RegExp;
  build: (match: RegExpExecArray) => RuleMatch;
};

/** A node that consumes the whole match. */
const whole = (match: RegExpExecArray, node: RichInline): RuleMatch => ({
  node,
  length: match[0].length,
});

/*
 * Emphasis markers open after a start, a space or punctuation and close before an end, a space or
 * punctuation, so `snake_case_name` and `2*3*4` stay text.
 */
const RULES: Rule[] = [
  { re: /`([^`\n]+)`/y, build: (m) => whole(m, { type: "code", text: m[1] }) },
  {
    re: /\[([^\]\n]+)\]\(([^)\s]+)\)/y,
    build: (m) => {
      const href = safeHref(m[2]);
      return href ? whole(m, { type: "link", href, children: parseInline(m[1]) }) : null;
    },
  },
  {
    re: /\*\*(?=\S)([\s\S]+?)(?<=\S)\*\*/y,
    build: (m) => whole(m, { type: "bold", children: parseInline(m[1]) }),
  },
  {
    re: /\|\|(?=\S)([\s\S]+?)(?<=\S)\|\|/y,
    build: (m) => whole(m, { type: "spoiler", children: parseInline(m[1]) }),
  },
  {
    re: /~~(?=\S)([\s\S]+?)(?<=\S)~~/y,
    build: (m) => whole(m, { type: "strike", children: parseInline(m[1]) }),
  },
  {
    re: /_(?=\S)([\s\S]+?)(?<=\S)_(?![\p{L}\p{N}_])/uy,
    build: (m) => whole(m, { type: "italic", children: parseInline(m[1]) }),
  },
  {
    // A bare URL keeps the punctuation after it as text: it consumes only the address.
    re: /(?:https?:\/\/|www\.)[^\s<]+/y,
    build: (m) => {
      const text = m[0].replace(URL_TAIL, "");
      const href = safeHref(text.startsWith("www.") ? `https://${text}` : text);
      return href
        ? { node: { type: "link", href, children: [{ type: "text", text }] }, length: text.length }
        : null;
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
        const built = rule.build(match);
        if (!built) continue;
        flush();
        out.push(built.node);
        index += built.length;
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

export type RichTextLabels = {
  /** Accessible name of a masked spoiler: its text is not read until it is revealed. */
  spoiler: string;
};

const RICH_TEXT_LABELS: RichTextLabels = { spoiler: "Скрытый текст" };

/**
 * A `||spoiler||`: a button named «Скрытый текст» over a masked run until it is pressed (click,
 * Enter, Space), then the run itself (its links work); a keyboard press moves the focus onto it, so
 * a screen reader goes on from the text. One way, like a chat: a revealed spoiler stays revealed.
 */
function Spoiler({
  nodes,
  highlight,
  labels,
}: {
  nodes: RichInline[];
  highlight: string;
  labels: RichTextLabels;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const moveFocus = React.useRef(false);
  React.useLayoutEffect(() => {
    if (revealed && moveFocus.current) textRef.current?.focus();
  }, [revealed]);
  if (revealed) {
    return (
      <span ref={textRef} className={styles.spoiler} data-state="revealed" tabIndex={-1}>
        {renderInline(nodes, highlight, labels)}
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
      className={styles.spoiler}
      data-state="masked"
      aria-label={labels.spoiler}
      onClick={reveal}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        reveal(event);
      }}
    >
      {/* Out of the accessibility tree until revealed; no search marks or links under the mask. */}
      <span aria-hidden="true">{renderInline(nodes, "", labels, true)}</span>
    </span>
  );
}

function renderInline(
  nodes: RichInline[],
  highlight: string,
  labels: RichTextLabels,
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
        return <strong key={key}>{renderInline(node.children, highlight, labels, masked)}</strong>;
      case "italic":
        return <em key={key}>{renderInline(node.children, highlight, labels, masked)}</em>;
      case "strike":
        return <s key={key}>{renderInline(node.children, highlight, labels, masked)}</s>;
      case "spoiler":
        // Inside a masked spoiler a nested one is masked text too (never a button in a button).
        return masked ? (
          <React.Fragment key={key}>{renderInline(node.children, "", labels, true)}</React.Fragment>
        ) : (
          <Spoiler key={key} nodes={node.children} highlight={highlight} labels={labels} />
        );
      case "code":
        return (
          <code key={key} className={styles.code}>
            {mark(node.text)}
          </code>
        );
      default:
        if (masked) {
          return (
            <React.Fragment key={key}>
              {renderInline(node.children, "", labels, true)}
            </React.Fragment>
          );
        }
        // A link. Not LinkButton: that is an inline-flex control, a link in running text wraps with the line.
        return (
          <a
            key={key}
            className={styles.link}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {renderInline(node.children, highlight, labels, masked)}
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
  labels?: Partial<RichTextLabels>;
};

/** A message text with its Markdown subset rendered safely; `end` closes the last text line. */
export function RichText({ source, end, highlight = "", labels: labelsProp }: RichTextProps) {
  const query = highlight.trim();
  const labels = useLabels(RICH_TEXT_LABELS, labelsProp);
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
              {renderInline(block.children, query, labels)}
              {tail}
            </blockquote>
          );
        }
        return (
          <p key={key} className={styles.paragraph}>
            {renderInline(block.children, query, labels)}
            {tail}
          </p>
        );
      })}
      {endsInText || end == null ? null : <p className={styles.paragraph}>{end}</p>}
    </>
  );
}
