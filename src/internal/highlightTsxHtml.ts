/** Примитивная подсветка TS/TSX для плейграунда: комментарии, строки, числа, ключевые слова, JSX-теги. */

const KW = new Set(
  "break case catch class const continue debugger default delete do else export extends false finally for from function if import in instanceof let new null return super switch this throw true try typeof var void while with yield async await of type interface implements package private protected public static readonly keyof as is enum namespace module declare abstract satisfies using".split(
    " ",
  ),
);

const INTRINSIC =
  /^(?:div|span|a|button|input|form|label|p|code|pre|section|article|header|footer|nav|main|aside|ul|ol|li|table|tr|td|th|img|svg|path|circle|Fragment|Suspense|h[1-6])\b/;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function span(cls: string, raw: string): string {
  return `<span class="${cls}">${esc(raw)}</span>`;
}

function readString(s: string, start: number, quote: '"' | "'" | "`"): number {
  let j = start + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === "\\" && j + 1 < s.length) {
      j += 2;
      continue;
    }
    if (c === quote) return j + 1;
    j++;
  }
  return s.length;
}

export function highlightTsxHtml(source: string): string {
  let i = 0;
  let out = "";
  const n = source.length;

  while (i < n) {
    const ch = source[i];
    const ch2 = source[i + 1];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      out += esc(ch);
      i++;
      continue;
    }

    if (ch === "/" && ch2 === "/") {
      let j = i + 2;
      while (j < n && source[j] !== "\n") j++;
      out += span("prime-tok-c", source.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "/" && ch2 === "*") {
      let j = i + 2;
      while (j + 1 < n && !(source[j] === "*" && source[j + 1] === "/")) j++;
      j = j + 2 <= n ? j + 2 : n;
      out += span("prime-tok-c", source.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "`") {
      const j = readString(source, i, "`");
      out += span("prime-tok-s", source.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '"') {
      const j = readString(source, i, '"');
      out += span("prime-tok-s", source.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "'") {
      const j = readString(source, i, "'");
      out += span("prime-tok-s", source.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "<" && source.slice(i, i + 4) === "<!--") {
      const end = source.indexOf("-->", i + 4);
      const j = end === -1 ? n : end + 3;
      out += span("prime-tok-c", source.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "<") {
      const mm = source.slice(i).match(/^<(\/?)([A-Za-z_][\w.]*)\b/);
      if (mm) {
        const name = mm[2];
        const isJsx = /^[A-Z]/.test(name) || INTRINSIC.test(name);
        if (isJsx) {
          const len = mm[0].length;
          out += span("prime-tok-x", source.slice(i, i + len));
          i += len;
          continue;
        }
      }
      out += esc("<");
      i++;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i + 1;
      while (j < n && /[\d.eE+-]/.test(source[j])) j++;
      out += span("prime-tok-n", source.slice(i, j));
      i = j;
      continue;
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[a-zA-Z0-9_$]/.test(source[j])) j++;
      const w = source.slice(i, j);
      out += KW.has(w) ? span("prime-tok-k", w) : esc(w);
      i = j;
      continue;
    }

    out += esc(ch);
    i++;
  }

  return out;
}
