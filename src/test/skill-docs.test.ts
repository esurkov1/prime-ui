// @vitest-environment node
/**
 * SKILL docs contract: every ```tsx snippet in `SKILL/*.md` typechecks against the kit
 * ("prime-ui-kit" → src/index.ts, the repo tsconfig), and every relative link in `SKILL/*.md`
 * and every repository link in `llms.txt` points at a file that exists.
 *
 * A snippet that is a fragment on purpose (bad → good lines, `…`) opts out with the fence info
 * ```tsx partial — everything else must be a whole module that compiles.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

const skillDocs = fs
  .readdirSync(path.join(root, "SKILL"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `SKILL/${file}`)
  .sort();

type Snippet = { doc: string; line: number; code: string; partial: boolean };

/** Fenced ```tsx blocks of a markdown file with the line of their first code line. */
function tsxSnippets(doc: string): Snippet[] {
  const lines = read(doc).split("\n");
  const snippets: Snippet[] = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```tsx(?:\s+(\S+))?\s*$/);
    if (!open) continue;
    const end = lines.indexOf("```", i + 1);
    if (end === -1) throw new Error(`${doc}:${i + 1}: unclosed fence`);
    snippets.push({
      doc,
      line: i + 2,
      code: lines.slice(i + 1, end).join("\n"),
      partial: open[1] === "partial",
    });
    i = end;
  }
  return snippets;
}

const snippets = skillDocs.flatMap(tsxSnippets);
const compiled = snippets.filter((snippet) => !snippet.partial);

/** Virtual file of a snippet, next to its doc so relative imports resolve like in an app. */
const snippetFile = ({ doc, line }: Snippet) =>
  path.join(root, "SKILL", `.snippet-${path.basename(doc, ".md")}-${line}.tsx`);

function compileSnippets(): Map<string, string[]> {
  const configPath = path.join(root, "tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root);
  const compilerOptions: ts.CompilerOptions = { ...options, noEmit: true, types: [] };

  const files = new Map(compiled.map((snippet) => [snippetFile(snippet), snippet.code]));
  const host = ts.createCompilerHost(compilerOptions);
  const { fileExists, readFile, getSourceFile } = host;
  host.fileExists = (name) => files.has(name) || fileExists.call(host, name);
  host.readFile = (name) => files.get(name) ?? readFile.call(host, name);
  host.getSourceFile = (name, languageVersion, ...rest) => {
    const code = files.get(name);
    return code === undefined
      ? getSourceFile.call(host, name, languageVersion, ...rest)
      : ts.createSourceFile(name, code, languageVersion, true, ts.ScriptKind.TSX);
  };

  const rootNames = [...files.keys(), path.join(root, "src/types/css-modules.d.ts")];
  const program = ts.createProgram({ rootNames, options: compilerOptions, host });
  const result = new Map<string, string[]>();
  for (const name of files.keys()) {
    const source = program.getSourceFile(name);
    const diagnostics = source
      ? [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)]
      : [];
    result.set(
      name,
      diagnostics.map((diagnostic) => {
        const at =
          diagnostic.file && diagnostic.start !== undefined
            ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line
            : 0;
        return `+${at}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
      }),
    );
  }
  return result;
}

describe("SKILL snippets", () => {
  let diagnostics: Map<string, string[]>;

  beforeAll(() => {
    diagnostics = compileSnippets();
  }, 120_000);

  it("finds the snippets and the cheatsheet ones are whole modules", () => {
    expect(compiled.length).toBeGreaterThan(5);
    const cheatsheet = snippets.filter((snippet) => snippet.doc === "SKILL/cheatsheet.md");
    expect(cheatsheet.length).toBeGreaterThan(0);
    expect(cheatsheet.every((snippet) => !snippet.partial)).toBe(true);
  });

  it.each(
    compiled.map((snippet) => [`${snippet.doc}:${snippet.line}`, snippet] as const),
  )("%s typechecks against the kit", (_, snippet) => {
    // Lines in the messages are relative to the first code line of the block.
    expect(diagnostics.get(snippetFile(snippet))).toEqual([]);
  });
});

const GITHUB = /^https:\/\/github\.com\/esurkov1\/prime-ui\/(?:blob|tree)\/main\/(.+)$/;

/** Markdown link targets `[text](target)` without the anchor; external links are skipped. */
function linkTargets(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1].replace(/#.*$/, ""))
    .filter((target) => target !== "" && !/^(mailto:|https?:)/.test(target));
}

describe("SKILL links", () => {
  it.each(skillDocs)("%s links resolve", (doc) => {
    const missing = linkTargets(read(doc)).filter(
      (target) => !fs.existsSync(path.resolve(root, path.dirname(doc), target)),
    );
    expect(missing).toEqual([]);
  });

  it("llms.txt links resolve to repository files and cover the skill", () => {
    const text = read("llms.txt");
    expect(text).toMatch(/^# prime-ui-kit\n\n> /);
    const urls = [...text.matchAll(/\]\((https:[^)\s]+)\)/g)].map((m) => m[1]);
    const files = urls.map((url) => url.match(GITHUB)?.[1]);
    expect(files.filter((file) => file === undefined).length, "non-repository link").toBe(0);
    const missing = files.filter((file) => file && !fs.existsSync(path.join(root, file)));
    expect(missing).toEqual([]);
    for (const required of [
      "SKILL/SKILL.md",
      "SKILL/cheatsheet.md",
      "SKILL/components.md",
      "SKILL/choosing.md",
      "SKILL/composition.md",
      "SKILL/patterns",
      "docs/foundation.md",
    ]) {
      expect(files, required).toContain(required);
    }
  });

  it("SKILL.md sends the reader to the cheatsheet first", () => {
    const howTo = read("SKILL/SKILL.md").split("## How to use this skill")[1] ?? "";
    expect(howTo.trimStart().split("\n")[0]).toContain("(cheatsheet.md)");
  });
});

describe("Setup docs", () => {
  const exportsMap = JSON.parse(read("package.json")).exports as Record<string, string>;
  const setupDocs = ["README.md", ...skillDocs, "playground/pages/IntroPage.tsx"];

  it.each(setupDocs)("%s names only exported package entries", (doc) => {
    const entries = [...read(doc).matchAll(/prime-ui-kit\/([a-z-]+\.css)/g)].map((m) => m[1]);
    expect(entries.filter((entry) => !(`./${entry}` in exportsMap))).toEqual([]);
  });

  it("the setup snippets import bundle.css, the one stylesheet components need", () => {
    for (const doc of ["README.md", "SKILL/SKILL.md", "SKILL/cheatsheet.md"]) {
      expect(read(doc), doc).toContain('import "prime-ui-kit/bundle.css";');
    }
  });
});
