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
