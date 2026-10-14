/**
 * Minimal TS / TSX tokenizer for CodeBlock: comments, strings, numbers, keywords and JSX tags. It
 * returns plain tokens, never markup — the component renders each as a text node in a span.
 */

export type TsxTokenKind = "keyword" | "string" | "comment" | "number" | "tag" | "text";

type TsxToken = { kind: TsxTokenKind; text: string };

const KEYWORDS = new Set(
  "break case catch class const continue debugger default delete do else export extends false finally for from function if import in instanceof let new null return super switch this throw true try typeof var void while with yield async await of type interface implements package private protected public static readonly keyof as is enum namespace module declare abstract satisfies using".split(
    " ",
  ),
);

const INTRINSIC =
  /^(?:div|span|a|button|input|form|label|p|code|pre|section|article|header|footer|nav|main|aside|ul|ol|li|table|tr|td|th|img|svg|path|circle|Fragment|Suspense|h[1-6])\b/;

const JSX_TAG = /<\/?([A-Za-z_][\w.]*)\b/y;

/** A numeric literal: hex / binary / octal, or decimal with a fraction and an exponent (`1e-3`). */
const NUMBER = /(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?)n?/y;

const IDENTIFIER = /[a-zA-Z_$][\w$]*/y;

/** A sticky pattern matched exactly at `index`. */
function matchAt(pattern: RegExp, source: string, index: number): RegExpExecArray | null {
  pattern.lastIndex = index;
  return pattern.exec(source);
}

function stringEnd(source: string, start: number, quote: string): number {
  let index = start + 1;
  while (index < source.length) {
    const char = source[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === quote) return index + 1;
    index += 1;
  }
  return source.length;
}

/** The end of the token of a non-text kind starting at `index`, or `null` for plain text. */
function readToken(source: string, index: number): { kind: TsxTokenKind; end: number } | null {
  const char = source[index];
  if (source.startsWith("//", index)) {
    const end = source.indexOf("\n", index);
    return { kind: "comment", end: end === -1 ? source.length : end };
  }
  if (source.startsWith("/*", index)) {
    const end = source.indexOf("*/", index + 2);
    return { kind: "comment", end: end === -1 ? source.length : end + 2 };
  }
  if (source.startsWith("<!--", index)) {
    const end = source.indexOf("-->", index + 4);
    return { kind: "comment", end: end === -1 ? source.length : end + 3 };
  }
  if (char === '"' || char === "'" || char === "`") {
    return { kind: "string", end: stringEnd(source, index, char) };
  }
  if (char === "<") {
    const tag = matchAt(JSX_TAG, source, index);
    const name = tag?.[1] ?? "";
    if (tag && (/^[A-Z]/.test(name) || INTRINSIC.test(name))) {
      return { kind: "tag", end: index + tag[0].length };
    }
    return null;
  }
  // A digit inside a name (`h1`, `x2`) belongs to the name, read below as one identifier.
  const number = matchAt(NUMBER, source, index);
  if (number) return { kind: "number", end: index + number[0].length };
  const word = matchAt(IDENTIFIER, source, index);
  if (word) {
    return { kind: KEYWORDS.has(word[0]) ? "keyword" : "text", end: index + word[0].length };
  }
  return null;
}

/** The tokens of a TS / TSX source, in order; their texts join back into the source. */
export function highlightTsx(source: string): TsxToken[] {
  const tokens: TsxToken[] = [];
  const push = (kind: TsxTokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    if (kind === "text" && last?.kind === "text") last.text += text;
    else tokens.push({ kind, text });
  };
  let index = 0;
  while (index < source.length) {
    const token = readToken(source, index);
    if (token) {
      push(token.kind, source.slice(index, token.end));
      index = token.end;
    } else {
      push("text", source[index]);
      index += 1;
    }
  }
  return tokens;
}
