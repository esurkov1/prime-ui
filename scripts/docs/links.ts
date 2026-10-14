/**
 * The one markdown link checker: a relative link resolves when its file exists and its `#anchor`
 * names a heading of that file by GitHub's slug rule. Used by the skill build
 * (`scripts/build-skill.ts`, over the built skill) and the docs contracts (`src/test/*`, over the
 * repository).
 */
import fs from "node:fs";
import path from "node:path";

/** The heading anchor GitHub gives `heading`: lower case, punctuation dropped, spaces → `-`. */
export function githubSlug(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

/** Every heading anchor of a markdown document (repeated headings get `-1`, `-2`…). */
export function headingSlugs(markdown: string): Set<string> {
  const slugs = new Set<string>();
  const counts = new Map<string, number>();
  const body = markdown.replace(/^```[\s\S]*?^```$/gm, "");
  for (const m of body.matchAll(/^#{1,6} (.+)$/gm)) {
    const slug = githubSlug(m[1].replace(/`/g, ""));
    const count = counts.get(slug) ?? 0;
    slugs.add(count === 0 ? slug : `${slug}-${count}`);
    counts.set(slug, count + 1);
  }
  return slugs;
}

/** Markdown link targets `[text](target)` of a text; external and mail links are skipped. */
export function linkTargets(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((target) => target !== "" && !/^[a-z]+:/i.test(target));
}

/**
 * Why the link `target` of the markdown file `from` (absolute) does not resolve, or `null`: the
 * file must exist and an `#anchor` into a markdown file must name one of its headings.
 */
export function brokenLinkAt(from: string, target: string): string | null {
  const [file, anchor] = target.split("#");
  const resolved = file === "" ? from : path.resolve(path.dirname(from), file);
  if (!fs.existsSync(resolved)) return `${target}: no file`;
  if (anchor && resolved.endsWith(".md")) {
    if (!headingSlugs(fs.readFileSync(resolved, "utf8")).has(anchor)) {
      return `${target}: no heading #${anchor}`;
    }
  }
  return null;
}
