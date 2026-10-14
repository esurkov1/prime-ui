// @vitest-environment node
/**
 * SKILL docs contract: everything a reader copies from the docs compiles, every link resolves,
 * every name exists, and every aggregate is what the code says.
 * - Every ```tsx snippet in `SKILL/*.md` and `README.md` typechecks against the kit
 *   ("prime-ui-kit" → src/index.ts, the repo tsconfig); a fragment on purpose (bad → good
 *   lines, `…`) opts out with ```tsx partial. A ```tsx good block (the good half of a bad → good
 *   pair) typechecks as JSX with every kit export in scope, `styles` and the placeholders its
 *   `// declare: …` lines name.
 * - The files of the skill evals compile, and every `files` path of `evals.json` exists.
 * - Every relative link in `SKILL/*.md` and every repository link in `llms.txt` resolves, an
 *   `#anchor` included (GitHub heading slugs).
 * - SKILL prose names only documented parts and props; a checklist item links to its rule; a rule
 *   is written once.
 * - The component counts of package.json, README and llms.txt are the number of component dirs;
 *   the screen index of composition.md lists every `examples/screen.tsx`.
 *
 * The rules that landed after their offenders are ratchets (`./ratchet.ts`).
 */
import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

import type { ComponentApi } from "../../scripts/docs/componentApi";
import { brokenLink, componentDirs, linkTargets, read, root, walk } from "./contract-utils";
import { numbered, ratchet } from "./ratchet";

const skillDocs = fs
  .readdirSync(path.join(root, "SKILL"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => `SKILL/${file}`)
  .sort();

type Snippet = { doc: string; line: number; code: string; kind: "module" | "partial" | "good" };

/** Fenced ```tsx blocks of a markdown file with the line of their first code line. */
function tsxSnippets(doc: string): Snippet[] {
  const lines = read(doc).split("\n");
  const snippets: Snippet[] = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```tsx(?:\s+(\S+))?\s*$/);
    if (!open) continue;
    const end = lines.indexOf("```", i + 1);
    if (end === -1) throw new Error(`${doc}:${i + 1}: unclosed fence`);
    const kind = open[1] === "partial" ? "partial" : open[1] === "good" ? "good" : "module";
    snippets.push({ doc, line: i + 2, code: lines.slice(i + 1, end).join("\n"), kind });
    i = end;
  }
  return snippets;
}

const apiModules = import.meta.glob<{ api: ComponentApi }>("../{components,layout}/*/api.ts", {
  eager: true,
});
const apis = Object.values(apiModules).map((module) => module.api);

/** Every documented part name and its props. */
const PARTS = new Map<string, { props: Set<string>; rest: boolean }>();
for (const api of apis) {
  for (const part of api.parts) {
    for (const name of part.name.split(" · ")) {
      const props = new Set(part.props.flatMap((prop) => prop.name.split(/ · | \/ /)));
      PARTS.set(name, { props, rest: props.has("…rest") });
    }
  }
}

/** A module specifier of `from` resolved to a repository file. */
function resolveModule(from: string, specifier: string): string | null {
  const base = path.posix.join(path.posix.dirname(from), specifier);
  for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    if (fs.existsSync(path.join(root, candidate))) return candidate;
  }
  return null;
}

/**
 * The value exports of the main entry, for the scope of a ```tsx good block: the names of its
 * `export { … } from` lines and of the modules it re-exports whole (`export * from`).
 */
function kitNames(): string[] {
  const names = new Set<string>();
  const seen = new Set<string>();
  const visit = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = read(file);
    for (const m of source.matchAll(/^export \{([^}]*)\} from/gm)) {
      for (const item of m[1].split(",")) {
        const name =
          item
            .trim()
            .split(/\s+as\s+/)
            .pop() ?? "";
        if (/^[A-Za-z]\w*$/.test(name)) names.add(name);
      }
    }
    for (const m of source.matchAll(/^export (?:async )?(?:function|const|class) ([A-Za-z]\w*)/gm)) {
      names.add(m[1]);
    }
    for (const m of source.matchAll(/^export \* from "([^"]+)";$/gm)) {
      const target = resolveModule(file, m[1]);
      if (target) visit(target);
    }
  };
  visit("src/index.ts");
  return [...names].sort();
}

const docs = [...skillDocs, "README.md"];
const snippets = docs.flatMap(tsxSnippets);
const compiled = snippets.filter((snippet) => snippet.kind !== "partial");
const evalFiles = walk("evals/prime-ui-kit/files", /\.tsx?$/);

/** Virtual file of a snippet, next to its doc so relative imports resolve like in an app. */
const snippetFile = ({ doc, line }: Snippet) =>
  path.join(root, path.dirname(doc), `.snippet-${path.basename(doc, ".md")}-${line}.tsx`);

/** The module a snippet compiles as: a whole module, or a good half in the kit's scope. */
function moduleOf(snippet: Snippet): string {
  if (snippet.kind !== "good") return snippet.code;
  const declares = [...snippet.code.matchAll(/^\/\/ declare: (.+)$/gm)].map(
    (m) => `declare ${m[1].replace(/;$/, "")};`,
  );
  const body = snippet.code.replace(/^\/\/ .*$/gm, "").trim();
  return [
    `import { ${kitNames().join(", ")} } from "prime-ui-kit";`,
    "declare const styles: Record<string, string>;",
    ...declares,
    `export const good = (\n<>\n${body}\n</>\n);`,
  ].join("\n");
}

function compile(): Map<string, string[]> {
  const configPath = path.join(root, "tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root);
  const compilerOptions: ts.CompilerOptions = {
    ...options,
    noEmit: true,
    types: [],
    noUnusedLocals: false,
  };

  const files = new Map(compiled.map((snippet) => [snippetFile(snippet), moduleOf(snippet)]));
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

  const evals = evalFiles.map((file) => path.join(root, file));
  const rootNames = [...files.keys(), ...evals, path.join(root, "src/types/css-modules.d.ts")];
  const program = ts.createProgram({ rootNames, options: compilerOptions, host });
  const result = new Map<string, string[]>();
  for (const name of [...files.keys(), ...evals]) {
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

describe("snippets compile", () => {
  let diagnostics: Map<string, string[]>;

  beforeAll(() => {
    diagnostics = compile();
  }, 180_000);

  it("finds the snippets and the cheatsheet ones are whole modules", () => {
    expect(compiled.length).toBeGreaterThan(5);
    const cheatsheet = snippets.filter((snippet) => snippet.doc === "SKILL/cheatsheet.md");
    expect(cheatsheet.length).toBeGreaterThan(0);
    expect(cheatsheet.every((snippet) => snippet.kind === "module")).toBe(true);
  });

  it.each(
    compiled.map((snippet) => [`${snippet.doc}:${snippet.line}`, snippet] as const),
  )("%s typechecks against the kit", (_, snippet) => {
    // Lines in the messages are relative to the first code line of the block.
    expect(diagnostics.get(snippetFile(snippet))).toEqual([]);
  });

  it.each(evalFiles)("%s (an eval's starting screen) compiles", (file) => {
    expect(diagnostics.get(path.join(root, file))).toEqual([]);
  });

  it("every file an eval starts from exists", () => {
    const { evals } = JSON.parse(read("evals/prime-ui-kit/evals.json")) as {
      evals: { files?: string[] }[];
    };
    const missing = evals
      .flatMap((item) => item.files ?? [])
      .filter((file) => !fs.existsSync(path.join(root, file)));
    expect(missing).toEqual([]);
  });

  it("the good halves of bad → good pairs are their own ```tsx good blocks (skill-good-halves)", () => {
    const offenders = snippets
      .filter((snippet) => snippet.kind === "partial" && /^\/\/ good\b/m.test(snippet.code))
      .map((snippet) => `${snippet.doc}: a partial block holds a good half`);
    ratchet("skill-good-halves", numbered(offenders));
  });
});

const GITHUB = /^https:\/\/github\.com\/esurkov1\/prime-ui\/(?:blob|tree)\/main\/(.+)$/;

describe("SKILL links", () => {
  it.each(skillDocs)("%s links resolve, anchors included", (doc) => {
    const broken = linkTargets(read(doc))
      .map((target) => brokenLink(doc, target))
      .filter((problem): problem is string => problem !== null);
    expect(broken).toEqual([]);
  });

  it("llms.txt links resolve to repository files and cover the skill", () => {
    const text = read("llms.txt");
    expect(text).toMatch(/^# prime-ui-kit\n\n> /);
    const urls = [...text.matchAll(/\]\((https:[^)\s]+)\)/g)].map((m) => m[1]);
    const targets = urls.map((url) => url.match(GITHUB)?.[1]);
    expect(targets.filter((target) => target === undefined).length, "non-repository link").toBe(0);
    const broken = targets
      .map((target) => (target ? brokenLink("llms.txt", target) : null))
      .filter((problem): problem is string => problem !== null);
    expect(broken).toEqual([]);
    const files = targets.map((target) => target?.split("#")[0]);
    for (const required of [
      "SKILL/SKILL.md",
      "SKILL/cheatsheet.md",
      "SKILL/components.md",
      "SKILL/choosing.md",
      "SKILL/composition.md",
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

/** Prose of a markdown doc: code blocks dropped. */
const prose = (doc: string) => read(doc).replace(/^```[\s\S]*?^```$/gm, "");

/** Native attributes a part with a `…rest` row takes beside its own props. */
const NATIVE =
  /^(aria-[\w-]+|data-[\w-]+|on[A-Z]\w*|className|style|id|role|title|href|type|name|value|placeholder|disabled|tabIndex|autoFocus|autoComplete|inputMode|target|rel|htmlFor|key|ref|children)$/;

describe("SKILL prose", () => {
  it("names only documented parts and their props (skill-api-names)", () => {
    const offenders: string[] = [];
    for (const doc of skillDocs) {
      const text = prose(doc);
      for (const m of text.matchAll(/`([A-Z]\w*\.[A-Z]\w*)`/g)) {
        // `X.Part`: the vocabulary's placeholder component, not a reference.
        if (!m[1].startsWith("X.") && !PARTS.has(m[1]))
          offenders.push(`${doc}: \`${m[1]}\` is no documented part`);
      }
      for (const m of text.matchAll(
        /<([A-Z]\w*(?:\.[A-Z]\w*)?)((?:\s+[\w-]+(?:=(?:"[^"]*"|\{[^}]*\}))?)+)\s*\/?>/g,
      )) {
        const part = PARTS.get(m[1]) ?? PARTS.get(`${m[1]}.Root`);
        if (!part) continue;
        for (const attr of m[2].matchAll(/\s([\w-]+)(?==|\s|$)/g)) {
          const prop = attr[1];
          if (part.props.has(prop) || (part.rest && NATIVE.test(prop))) continue;
          offenders.push(`${doc}: <${m[1]} ${prop}> is no documented prop`);
        }
      }
    }
    ratchet("skill-api-names", numbered(offenders));
  });

  it("every checklist item links to the rule it checks (skill-checklist-anchors)", () => {
    const items = read("SKILL/checklist.md")
      .split(/\n(?=- \[ \])/)
      .filter((item) => item.startsWith("- [ ]"));
    expect(items.length).toBeGreaterThan(10);
    const offenders = items
      .filter((item) => !/\]\([^)]*#[^)]+\)/.test(item))
      .map((item) => `SKILL/checklist.md: ${item.slice(6, 70).replace(/\s+/g, " ")}`);
    ratchet("skill-checklist-anchors", offenders);
  });

  it("writes every rule once: no sentence repeated across SKILL files (skill-duplicates)", () => {
    const seen = new Map<string, string>();
    const offenders: string[] = [];
    for (const doc of skillDocs) {
      for (const sentence of prose(doc)
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s/)) {
        const text = sentence.trim();
        if (text.length < 80) continue;
        const first = seen.get(text);
        if (first && first !== doc)
          offenders.push(`${doc}: repeats ${first}: «${text.slice(0, 60)}…»`);
        else seen.set(text, doc);
      }
    }
    ratchet("skill-duplicates", offenders);
  });
});

describe("aggregates", () => {
  const count = componentDirs().length;

  it("package.json, README and llms.txt count every component dir", () => {
    const description = (JSON.parse(read("package.json")) as { description: string }).description;
    for (const [where, text] of [
      ["package.json", description],
      ["README.md", read("README.md")],
      ["llms.txt", read("llms.txt")],
    ] as const) {
      const counts = [...text.matchAll(/\b(\d+) (?:composable )?components\b/g)].map((m) =>
        Number(m[1]),
      );
      expect(counts.length, `${where} states the component count`).toBeGreaterThan(0);
      expect(counts, where).toEqual(counts.map(() => count));
    }
  });

  it("the screen index of composition.md lists every examples/screen.tsx", () => {
    const listed = [
      ...read("SKILL/composition.md").matchAll(
        /\]\(\.\.\/(src\/[\w/-]+\/examples\/screen\.tsx)\)/g,
      ),
    ].map((m) => m[1]);
    const screens = componentDirs()
      .map(({ rel }) => `${rel}/examples/screen.tsx`)
      .filter((file) => fs.existsSync(path.join(root, file)))
      .sort();
    expect([...new Set(listed)].sort()).toEqual(screens);
  });

  it("the playground never passes a snippet as a JSX string to CodeBlock (code-snippets)", () => {
    const offenders: string[] = [];
    for (const file of walk("playground", /\.tsx$/)) {
      const source = read(file);
      for (const m of source.matchAll(/<CodeBlock\b[^>]*\bcode=\{(\w+)\}/g)) {
        const init = source.match(
          new RegExp(`const ${m[1]}\\s*=\\s*(\`[\\s\\S]*?\`|"[^"]*")`),
        )?.[1];
        if (init && /<[A-Z]/.test(init)) offenders.push(`${file}: ${m[1]}`);
      }
      if (/<CodeBlock\b[^>]*\bcode=(?:"|\{`)[^"`]*<[A-Z]/.test(source)) {
        offenders.push(`${file}: inline JSX string`);
      }
    }
    ratchet("code-snippets", offenders);
  });
});

describe("Setup docs", () => {
  const exportsMap = JSON.parse(read("package.json")).exports as Record<string, string>;
  const setupDocs = ["README.md", ...skillDocs, "playground/foundation/snippets/install.tsx"];

  it.each(setupDocs)("%s names only exported package entries", (doc) => {
    const entries = [...read(doc).matchAll(/prime-ui-kit\/([a-z-]+\.css)/g)].map((m) => m[1]);
    expect(entries.filter((entry) => !(`./${entry}` in exportsMap))).toEqual([]);
  });

  it("`npx prime-ui-kit skill` has its bin: a normalized path npm publishes as is", () => {
    // npm rewrites a `./`-prefixed bin path at publish and the registry manifest loses `bin`.
    const { bin } = JSON.parse(read("package.json")) as { bin: Record<string, string> };
    expect(bin).toEqual({ "prime-ui-kit": "bin/prime-ui-kit.js" });
  });

  it("the setup snippets import bundle.css, the one stylesheet components need", () => {
    for (const doc of ["README.md", "SKILL/SKILL.md", "SKILL/cheatsheet.md"]) {
      expect(read(doc), doc).toContain('import "prime-ui-kit/bundle.css";');
    }
  });
});
