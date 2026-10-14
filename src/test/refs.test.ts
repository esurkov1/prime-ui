// @vitest-environment node
/**
 * References in docs and comments resolve:
 * - `foundation §N "Heading"` — the quoted heading or term is in section N of docs/foundation.md;
 * - `bun run <script>` — the script is in package.json (or the file exists);
 * - a backticked repository path (`src/internal/touchTarget`, `scripts/build-docs.ts`) exists;
 * - a comment of an examples stylesheet that names `<file>.tsx` heads a class that file uses;
 * - every module of `src/internal` is in the repository map of CLAUDE.md (§9);
 * - the motion token table of foundation §7 has every motion token, with its generated value.
 */
import fs from "node:fs";
import path from "node:path";

import { componentDirs, exists, read, root, walk } from "./contract-utils";

const foundation = read("docs/foundation.md");

/** The text of `## N.` in foundation.md, subsections included. */
function foundationSection(n: string): string {
  const start = foundation.search(new RegExp(`^## ${n}\\. `, "m"));
  if (start === -1) return "";
  const rest = foundation.slice(start + 3);
  const end = rest.search(/^## /m);
  return end === -1 ? rest : rest.slice(0, end);
}

/** Docs and sources whose references must resolve. */
const DOCS = [
  "CLAUDE.md",
  "README.md",
  "llms.txt",
  ...walk("SKILL", /\.md$/),
  ...walk("docs", /\.md$/),
  ...walk("src", /COMPONENT\.md$/),
];
const SOURCES = [
  ...walk("src", /\.(tsx?|css)$/),
  ...walk("scripts", /\.ts$/),
  ...walk("playground", /\.(tsx?|css)$/),
  ...walk("tokens", /\.ts$/),
].filter((file) => !/^src\/styles\/(tokens|theme-light|theme-dark)\.css$/.test(file));

const scripts = Object.keys(
  (JSON.parse(read("package.json")) as { scripts: Record<string, string> }).scripts,
);

/** A repository path as written: with or without its extension, a file or a dir. */
function resolves(rel: string): boolean {
  const clean = rel.replace(/[#:].*$/, "").replace(/\/$/, "");
  if (/[*<>{}]|…/.test(clean)) return true;
  return ["", ".ts", ".tsx", ".module.css", ".css", ".md", ".json", ".js"].some((ext) =>
    exists(`${clean}${ext}`),
  );
}

/** Basenames of every source file: a bare `x.module.css` in a comment names one of them. */
const BASENAMES = new Set(
  [
    ...walk("src", /\.(tsx?|css)$/),
    ...walk("playground", /\.(tsx?|css)$/),
    ...walk("scripts", /\.ts$/),
    ...walk("tokens", /\.ts$/),
  ].map((file) => path.posix.basename(file)),
);

const PATH = /`((?:src|scripts|playground|tokens|docs|SKILL|evals|bin)\/[\w./@-]+)`/g;

describe("references resolve", () => {
  it("section, script and path references", () => {
    const offenders: string[] = [];
    for (const file of [...DOCS, ...SOURCES]) {
      const text = read(file);
      for (const m of text.matchAll(/§(\d+)(?:\.\d+)? "([^"]+)"/g)) {
        if (!foundationSection(m[1]).includes(m[2])) {
          offenders.push(`${file}: §${m[1]} "${m[2]}" is not in that section`);
        }
      }
      // An example's text is app content (a code message), not a reference.
      const commands = file.includes("/examples/") ? [] : text.matchAll(/\bbun run ([\w:./-]+)/g);
      for (const m of commands) {
        const target = m[1];
        if (!scripts.includes(target) && !exists(target)) {
          offenders.push(`${file}: bun run ${target}`);
        }
      }
      for (const m of text.matchAll(PATH)) {
        if (!resolves(m[1])) offenders.push(`${file}: ${m[1]}`);
      }
      for (const m of text.matchAll(/`([\w-]+\.(?:module\.css|tsx|ts))`/g)) {
        // `X.tsx`, `x.ts`: a placeholder name, not a reference.
        if (!/^[xX]\./.test(m[1]) && !BASENAMES.has(m[1]))
          offenders.push(`${file}: ${m[1]} (no such file)`);
      }
    }
    expect(offenders, "refs").toEqual([]);
  });

  it("an examples stylesheet comment that names an example heads a class it uses", () => {
    const offenders: string[] = [];
    for (const { rel } of componentDirs()) {
      for (const css of walk(`${rel}/examples`, /\.css$/)) {
        const text = read(css);
        const chunks = text.split(/(\/\*[\s\S]*?\*\/)/);
        for (let i = 1; i < chunks.length; i += 2) {
          const named = [...chunks[i].matchAll(/([\w-]+)\.tsx\b/g)].map((m) => m[1]);
          if (named.length === 0) continue;
          const classes = [...(chunks[i + 1] ?? "").matchAll(/^\.([\w-]+)/gm)].map((m) => m[1]);
          if (classes.length === 0) continue;
          for (const stem of named) {
            const example = `${rel}/examples/${stem}.tsx`;
            if (!exists(example)) {
              offenders.push(`${css}: names ${stem}.tsx, which does not exist`);
              continue;
            }
            const source = read(example);
            if (!classes.some((name) => source.includes(`styles.${name}`))) {
              offenders.push(`${css}: names ${stem}.tsx, which uses none of its classes`);
            }
          }
        }
      }
    }
    expect(offenders, "refs-example-css").toEqual([]);
  });

  it("every internal module is in the CLAUDE.md repository map", () => {
    const map = read("CLAUDE.md").split(/^## 9\. Repository map/m)[1] ?? "";
    const names = new Set(
      fs
        .readdirSync(path.join(root, "src/internal"))
        .filter((name) => !/\.test\.tsx?$|\.api\.ts$|\.d\.ts$/.test(name))
        .map((name) => name.replace(/(\.module)?\.(tsx?|css)$/, "")),
    );
    const missing = [...names].filter((name) => !new RegExp(`\\b${name}\\b`).test(map));
    expect(
      missing.map((name) => `CLAUDE.md §9: src/internal/${name}`),
      "refs-internal-map",
    ).toEqual([]);
  });

  it("the motion table of foundation §7 lists every motion token with its value", () => {
    const theme = read("src/styles/theme-light.css");
    const tokens = new Map(
      [...theme.matchAll(/^\s+(--prime-motion-[\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2]]),
    );
    const table = foundationSection("7").split("### Motion and micro-animation")[1] ?? "";
    const rows = [
      ...table.matchAll(/^\| `(--prime-motion-[\w-]+)`(?: \/ `(-[\w-]+)`)? \| ([^|]+) \|/gm),
    ];
    const offenders: string[] = [];
    const listed = new Set<string>();
    const numeric = (value: string) => {
      const ref = value.match(/var\(--prime-ref-[\w-]*?-(\d+(?:\.\d+)?)\)/)?.[1];
      return ref ?? value.trim().replace(/ms$/, "");
    };
    for (const [, name, suffix, cell] of rows) {
      const names = suffix ? [name, `${name}${suffix}`] : [name];
      const values = cell.split(" / ").map((value) => value.trim());
      names.forEach((token, index) => {
        listed.add(token);
        const declared = tokens.get(token);
        if (declared === undefined) {
          offenders.push(`foundation §7: ${token} is not a token`);
          return;
        }
        const documented = values[index]?.match(/^(\d+(?:\.\d+)?)( ms)?$/)?.[1];
        if (documented !== undefined && Number(documented) !== Number(numeric(declared))) {
          offenders.push(`foundation §7: ${token} is ${declared}, the table says ${values[index]}`);
        }
      });
    }
    for (const token of tokens.keys()) {
      if (!listed.has(token)) offenders.push(`foundation §7: ${token} is missing from the table`);
    }
    expect(offenders, "refs-motion-table").toEqual([]);
  });
});
