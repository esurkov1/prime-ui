/**
 * Library bundle via esbuild (no Rollup/treeshake pass that breaks CSS Modules).
 * JS: `src/index.ts` → `dist/index.js`, `src/color-picker.ts` → `dist/color-picker.js`,
 * `src/icon-set.ts` → `dist/icon-set.js` (next to its `icon-set.d.ts`; a `dist/icons.js` would shadow
 * the `dist/icons/` types folder for `./icons` specifiers), shared code in `dist/chunks/`. Every JS file starts with `"use client"` (checked).
 * CSS: the base layer (`src/styles/globals.css`: tokens, themes, focus ring,
 * reduced motion) followed by every component module → `dist/index.css` (`prime-ui-kit/bundle.css`,
 * minified). Types: the declarations of `tsconfig.dts.json` → `.dts-stage`, every documented prop
 * carrying its `api.ts` `en` text as JSDoc (the one prose source), merged into `dist/`; every
 * specifier is rewritten to an explicit relative path inside `dist/` (no `@/` alias, no directory
 * import) and the build fails on any specifier that leaves `dist/` or does not resolve.
 */

import { existsSync, readdirSync } from "node:fs";
import { cp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import ts from "typescript";

import { documentedProps, kitExports } from "./docs/apiTypes";
import type { ComponentApi } from "./docs/componentApi";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const USE_CLIENT = '"use client";';

await rm(dist, { recursive: true, force: true });

/*
 * Three JS entries: `prime-ui-kit`, `prime-ui-kit/color-picker` (the only code on react-aria) and
 * `prime-ui-kit/icons` (every glyph as a named, tree-shakable component). Splitting puts the shared
 * modules in chunks, so the entries use one copy of every context and glyph. A fourth, temporary
 * entry imports them all: one build keeps CSS Module class names identical, and its
 * CSS (every component) becomes `bundle.css`; the per-entry CSS files are dropped.
 */
const allEntry = resolve(root, ".bundle-all.ts");
await writeFile(
  allEntry,
  'export * from "./src/index";\nexport * from "./src/color-picker";\nexport * from "./src/icon-set";\n',
);
try {
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [
      { in: "src/index.ts", out: "index" },
      { in: "src/color-picker.ts", out: "color-picker" },
      { in: "src/icon-set.ts", out: "icon-set" },
      { in: ".bundle-all.ts", out: "all" },
    ],
    outdir: "dist",
    bundle: true,
    splitting: true,
    chunkNames: "chunks/[name]-[hash]",
    format: "esm",
    platform: "neutral",
    target: "es2022",
    tsconfig: "tsconfig.json",
    alias: { "@": resolve(root, "src") },
    packages: "external",
    logLevel: "info",
    loader: { ".module.css": "local-css" },
    /* Every component holds state or effects: each entry and chunk is a client module (RSC). */
    banner: { js: `${USE_CLIENT}\n` },
  });
} finally {
  await rm(allEntry, { force: true });
}
await rm(resolve(dist, "all.js"), { force: true });

/* Guard: every published JS file starts with the directive, or Next.js server components break. */
const jsFiles = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".js"));
const missing: string[] = [];
for (const file of jsFiles) {
  if (!(await readFile(resolve(dist, file), "utf8")).startsWith(USE_CLIENT)) missing.push(file);
}
if (missing.length > 0) throw new Error(`dist JS without "use client":\n${missing.join("\n")}`);
await rm(resolve(dist, "color-picker.css"), { force: true });
await rm(resolve(dist, "icon-set.css"), { force: true });

const base = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/styles/globals.css"],
  bundle: true,
  write: false,
  logLevel: "warning",
});
/* Shipped minified: comments, whitespace and duplicate declarations out (about a third of the raw
   size); the hashed class names and the rule order stay as built. */
const bundleCss = await esbuild.transform(
  base.outputFiles[0].text + (await readFile(resolve(dist, "all.css"), "utf8")),
  { loader: "css", minify: true, logLevel: "warning" },
);
if (bundleCss.warnings.length > 0) throw new Error("bundle.css minification warnings");
await writeFile(resolve(dist, "index.css"), bundleCss.code);
await rm(resolve(dist, "all.css"), { force: true });

const stage = resolve(root, ".dts-stage");
await rm(stage, { recursive: true, force: true });

/*
 * Declarations with the `api.ts` prose: every prop an `api.ts` table documents gets its `en` text
 * as the JSDoc of its declaration, so an editor shows the same words as COMPONENT.md.
 */
const dtsConfig = ts.getParsedCommandLineOfConfigFile(
  resolve(root, "tsconfig.dts.json"),
  undefined,
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  },
);
if (!dtsConfig) throw new Error("tsconfig.dts.json does not parse");
const dtsProgram = ts.createProgram(dtsConfig.fileNames, dtsConfig.options);
const apis: ComponentApi[] = [];
for (const base of ["components", "layout"]) {
  for (const dir of readdirSync(resolve(root, "src", base)).sort()) {
    const file = resolve(root, "src", base, dir, "api.ts");
    if (existsSync(file)) apis.push(((await import(file)) as { api: ComponentApi }).api);
  }
}
const propDocs = new Map<string, string>();
for (const { declaration, en } of documentedProps(dtsProgram, kitExports(dtsProgram, root), apis)) {
  propDocs.set(`${declaration.getSourceFile().fileName}:${declaration.pos}`, en);
}
/** `*` lines of a JSDoc block; a closing marker in the text is broken so the comment stays one. */
const jsdoc = (text: string) => `*\n * ${text.replaceAll("*/", "*\\/")}\n `;
const withApiDocs: ts.TransformerFactory<ts.SourceFile | ts.Bundle> = (context) => {
  const visit = (node: ts.Node): ts.Node => {
    const original = ts.getOriginalNode(node);
    if ((ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) && original.pos >= 0) {
      const text = propDocs.get(`${original.getSourceFile()?.fileName}:${original.pos}`);
      if (text) {
        ts.setEmitFlags(node, ts.EmitFlags.NoLeadingComments);
        ts.addSyntheticLeadingComment(
          node,
          ts.SyntaxKind.MultiLineCommentTrivia,
          jsdoc(text),
          true,
        );
      }
    }
    return ts.visitEachChild(node, visit, context);
  };
  return (file) => ts.visitNode(file, visit) as ts.SourceFile | ts.Bundle;
};
const emitted = dtsProgram.emit(undefined, undefined, undefined, true, {
  afterDeclarations: [withApiDocs],
});
const dtsErrors = [...ts.getPreEmitDiagnostics(dtsProgram), ...emitted.diagnostics].filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
if (dtsErrors.length > 0 || emitted.emitSkipped) {
  throw new Error(
    `declarations failed:\n${ts.formatDiagnostics(dtsErrors, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    })}`,
  );
}

/*
 * Declarations: `.dts-stage/src/*` lands in `dist/*`, `.dts-stage/tokens/*` in `dist/tokens/*`.
 * Each import / export specifier is resolved against the stage (the `@/` alias → `src/`), mapped to
 * its place in `dist/` and written back as an explicit relative path to the file. Bare package
 * specifiers stay. Anything that resolves outside the two staged trees fails the build.
 */
const stageSrc = resolve(stage, "src");
const stageTokens = resolve(stage, "tokens");

function toDist(stagePath: string): string | null {
  if (stagePath.startsWith(stageSrc + sep)) return resolve(dist, relative(stageSrc, stagePath));
  if (stagePath.startsWith(stageTokens + sep))
    return resolve(dist, "tokens", relative(stageTokens, stagePath));
  return null;
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolveDeclaration(base: string): Promise<string | null> {
  const stripped = base.replace(/\.(js|ts|tsx)$/, "");
  for (const candidate of [`${stripped}.d.ts`, resolve(stripped, "index.d.ts")]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

async function listDeclarations(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listDeclarations(path)));
    else if (entry.name.endsWith(".d.ts")) out.push(path);
  }
  return out;
}

const CSS_MODULE_DECLARATION =
  "declare const styles: Readonly<Record<string, string>>;\nexport default styles;\n";
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g;
const problems: string[] = [];
for (const file of [
  ...(await listDeclarations(stageSrc)),
  ...(await listDeclarations(stageTokens)),
]) {
  const fileDist = toDist(file);
  if (!fileDist) continue;
  const text = await readFile(file, "utf8");
  const replacements = new Map<string, string>();
  for (const match of text.matchAll(SPECIFIER)) {
    const spec = match[3];
    const isAlias = spec.startsWith("@/");
    if (!isAlias && !spec.startsWith(".")) continue;
    const base = isAlias ? resolve(stageSrc, spec.slice(2)) : resolve(dirname(file), spec);
    if (spec.endsWith(".module.css")) {
      /* A CSS Module typed by its declaration: `x.module.css.d.ts` with the class map. */
      await writeFile(`${base}.d.ts`, CSS_MODULE_DECLARATION);
    }
    const target = spec.endsWith(".module.css") ? `${base}.d.ts` : await resolveDeclaration(base);
    const targetDist = target ? toDist(target) : null;
    if (!targetDist) {
      problems.push(`${relative(stage, file)}: "${spec}" does not resolve inside dist/`);
      continue;
    }
    let rel = relative(dirname(fileDist), targetDist)
      .split(sep)
      .join("/")
      .replace(/\.d\.ts$/, "");
    if (!rel.startsWith(".")) rel = `./${rel}`;
    replacements.set(spec, rel);
  }
  const rewritten = text.replace(SPECIFIER, (whole, lead: string, quote: string, spec: string) => {
    const next = replacements.get(spec);
    return next ? `${lead}${quote}${next}${quote}` : whole;
  });
  if (rewritten !== text) await writeFile(file, rewritten);
}
if (problems.length > 0) {
  await rm(stage, { recursive: true, force: true });
  throw new Error(`Declaration specifiers outside dist/:\n${problems.join("\n")}`);
}

await cp(stageSrc, dist, { recursive: true });
await cp(stageTokens, resolve(dist, "tokens"), { recursive: true });
await rm(stage, { recursive: true, force: true });

/* Guard: no alias and no path out of `dist/` in any published declaration. */
const leaks: string[] = [];
for (const file of await listDeclarations(dist)) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(SPECIFIER)) {
    const spec = match[3];
    if (spec.startsWith("@/")) leaks.push(`${relative(dist, file)}: "${spec}"`);
    else if (spec.startsWith(".")) {
      const target = resolve(dirname(file), spec);
      if (target !== dist && !target.startsWith(dist + sep))
        leaks.push(`${relative(dist, file)}: "${spec}" leaves dist/`);
    }
  }
}
if (leaks.length > 0) throw new Error(`dist/**/*.d.ts leak internal paths:\n${leaks.join("\n")}`);
