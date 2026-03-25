/** Убирает строку self-import `?raw` из исходника секции плейграунда. */
export function stripExampleFrameSelfRawImport(source: string): string {
  return source.replace(/^import\s+[\w$]+\s+from\s+["'][^"']+\.tsx\?raw["'];\s*\r?\n?/m, "");
}
