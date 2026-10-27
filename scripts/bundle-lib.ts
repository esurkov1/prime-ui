/**
 * Library build via esbuild, module for module. JS: every source module at its own path in `dist/`;
 * `src/index.ts` → `dist/index.js`, `src/color-picker.ts` → `dist/color-picker.js`,
 * `src/icon-set.ts` → `dist/icon-set.js` (next to its `icon-set.d.ts`; a `dist/icons.js` would shadow
 * the `dist/icons/` types folder for `./icons` specifiers). CSS: every CSS Module beside its module
 * as `X.styles.js` + `X.styles.css`, the base layer as `dist/base.css`. Types: the declarations of `tsconfig.dts.json` → `.dts-stage`, every documented prop
 * carrying its `api.ts` `en` text as JSDoc (the one prose source), merged into `dist/`; every
 * specifier is rewritten to an explicit relative path inside `dist/` (no `@/` alias, no directory
 * import) and the build fails on any specifier that leaves `dist/` or does not resolve.
 */

import { existsSync, readdirSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
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
 * Module-for-module output: every source module the three entries reach (`prime-ui-kit`,
 * `prime-ui-kit/color-picker` — the only code on react-aria — and `prime-ui-kit/icons`) becomes its
 * own file in `dist/`, at its source path, its specifiers rewritten to the files beside it. With
 * `sideEffects` naming only the CSS and the entries, a consumer's bundler keeps only the modules a
 * screen uses. A CSS Module becomes `X.styles.js` (its class map) importing `X.styles.css` (its
 * rules), so the styles of a component travel with its code; the entries import `base.css`
 * (`src/styles/globals.css`: tokens, themes, focus ring, reduced motion) before anything else.
 * Every module but a re-export barrel starts with `"use client"` (checked): every component holds
 * state or effects, and Next.js refuses `export *` inside a client boundary, so a barrel stays a
 * server module that passes the client modules on.
 */
const ENTRIES = {
  "src/index.ts": "index",
  "src/color-picker.ts": "color-picker",
  "src/icon-set.ts": "icon-set",
};
const shared = {
  absWorkingDir: root,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  tsconfig: "tsconfig.json",
  logLevel: "warning",
} satisfies esbuild.BuildOptions;

const graph = await esbuild.build({
  ...shared,
  entryPoints: Object.keys(ENTRIES),
  bundle: true,
  write: false,
  metafile: true,
  outdir: "dist",
  alias: { "@": resolve(root, "src") },
  packages: "external",
  loader: { ".module.css": "local-css" },
});
const inputs = graph.metafile.inputs;
const modules = Object.keys(inputs).filter((path) => /\.tsx?$/.test(path));
const cssModules = Object.keys(inputs).filter((path) => path.endsWith(".module.css"));

/** The `dist/` path of a source module, without extension: `src/` drops its prefix, `tokens/` keeps it. */
function outPath(input: string): string {
  const stem = input.replace(/\.module\.css$/, ".styles").replace(/\.tsx?$/, "");
  if (stem.startsWith("src/")) {
    const rel = stem.slice("src/".length);
    return ENTRIES[input as keyof typeof ENTRIES] ?? rel;
  }
  if (stem.startsWith("tokens/")) return stem;
  throw new Error(`${input}: a module outside src/ and tokens/`);
}

function specifierTo(fromInput: string, toInput: string): string {
  let rel = relative(dirname(outPath(fromInput)), `${outPath(toInput)}.js`)
    .split(sep)
    .join("/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"']+)\2/g;
const head = (client: boolean, imports: string[]) =>
  [...(client ? [USE_CLIENT] : []), ...imports.map((spec) => `import "${spec}";`)].join("\n");
/** A module whose every statement re-exports: imports, `export … from`, `export { names }`. */
const REEXPORT =
  /^((export|import) (\*|\* as \w+|\{[^}]*\}) from "[^"]+";|import "[^"]+";|export \{[^}]*\};)$/;
const isBarrel = (code: string) =>
  code
    .split(/\n(?=export|import)/)
    .map((statement) => statement.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .every((statement) => REEXPORT.test(statement));

const compiled = await esbuild.build({
  ...shared,
  entryPoints: modules,
  bundle: false,
  write: false,
  outdir: "out",
  outbase: ".",
});
const unresolved: string[] = [];
for (const file of compiled.outputFiles) {
  const input = relative(resolve(root, "out"), file.path).replace(/\.js$/, "");
  const source = modules.find((path) => path.replace(/\.tsx?$/, "") === input);
  if (!source) throw new Error(`${file.path}: no source module`);
  const targets = new Map<string, string>();
  for (const dep of inputs[source].imports) {
    if (!dep.external && dep.original) targets.set(dep.original, specifierTo(source, dep.path));
  }
  const code = file.text.replace(SPECIFIER, (whole, lead: string, quote: string, spec: string) => {
    if (!spec.startsWith(".") && !spec.startsWith("@/")) return whole;
    const next = targets.get(spec);
    if (!next) unresolved.push(`${source}: "${spec}"`);
    return next ? `${lead}${quote}${next}${quote}` : whole;
  });
  await mkdir(dirname(resolve(dist, outPath(source))), { recursive: true });
  await writeFile(
    resolve(dist, `${outPath(source)}.js`),
    `${head(!isBarrel(code), source in ENTRIES ? ["./base.css"] : [])}\n${code}`,
  );
}
if (unresolved.length > 0)
  throw new Error(`Specifiers without a module:\n${unresolved.join("\n")}`);

/* One build for every CSS Module, so class names stay unique across the kit. */
const styles = await esbuild.build({
  ...shared,
  entryPoints: cssModules.map((path) => ({ in: `css-module:${path}`, out: outPath(path) })),
  bundle: true,
  write: false,
  outdir: "dist",
  minifyWhitespace: true,
  minifySyntax: true,
  loader: { ".module.css": "local-css" },
  plugins: [
    {
      name: "css-module-entry",
      setup(build) {
        build.onResolve({ filter: /^css-module:/ }, (args) => ({
          path: args.path.slice("css-module:".length),
          namespace: "css-module",
        }));
        build.onLoad({ filter: /.*/, namespace: "css-module" }, (args) => ({
          contents: `export { default } from ${JSON.stringify(resolve(root, args.path))};`,
          resolveDir: root,
          loader: "js",
        }));
      },
    },
  ],
});
if (styles.warnings.length > 0) throw new Error("CSS Module warnings");
for (const file of styles.outputFiles) {
  await mkdir(dirname(file.path), { recursive: true });
  if (file.path.endsWith(".css")) await writeFile(file.path, file.text);
  else {
    const css = `./${file.path.split(sep).at(-1)?.replace(/\.js$/, ".css")}`;
    await writeFile(file.path, `${head(true, [css])}\n${file.text}`);
  }
}

const base = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/styles/globals.css"],
  bundle: true,
  write: false,
  minify: true,
  logLevel: "warning",
});
if (base.warnings.length > 0) throw new Error("base.css warnings");
await writeFile(resolve(dist, "base.css"), base.outputFiles[0].text);

/* Guards: every module but a barrel starts with the directive (or Next.js server components break),
   no barrel does, and every relative specifier names a file that is in `dist/`. */
const jsFiles = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".js"));
const broken: string[] = [];
for (const file of jsFiles) {
  const text = await readFile(resolve(dist, file), "utf8");
  const barrel = isBarrel(text);
  if (text.startsWith(USE_CLIENT) === barrel)
    broken.push(`${file}: ${barrel ? "a barrel with" : "no"} "use client"`);
  for (const match of text.matchAll(SPECIFIER)) {
    const spec = match[3];
    if (spec.startsWith(".") && !(await isFile(resolve(dist, dirname(file), spec))))
      broken.push(`${file}: "${spec}" is not in dist/`);
  }
}
if (broken.length > 0) throw new Error(`dist JS:\n${broken.join("\n")}`);

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
