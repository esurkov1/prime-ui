/**
 * Splits a file name at its final extension: «отчёт.final.pdf» → `{ base: "отчёт.final", ext: "pdf" }`.
 * A name without an extension or a dotfile («.env») stays whole, with `ext` `""`. `ext` is lower
 * case; the one rule behind a format badge and the name trimmed beside it.
 */
export function splitFileName(name: string): { base: string; ext: string } {
  const dot = name.lastIndexOf(".");
  if (dot <= 0 || dot === name.length - 1) return { base: name, ext: "" };
  return { base: name.slice(0, dot), ext: name.slice(dot + 1).toLowerCase() };
}

/** The characters of a long name that stay in view when its middle is cut: the extension and a bit before it. */
const KEPT_TAIL = 6;

/**
 * Splits a long name for a cut in the middle: `head` gives way to an ellipsis, `tail` (the last
 * characters, the extension included) always stays. A name that is not longer than twice the tail
 * stays whole in `head`.
 */
export function splitNameTail(name: string): { head: string; tail: string } {
  const chars = Array.from(name);
  if (chars.length <= KEPT_TAIL * 2) return { head: name, tail: "" };
  return {
    head: chars.slice(0, -KEPT_TAIL).join(""),
    tail: chars.slice(-KEPT_TAIL).join(""),
  };
}
