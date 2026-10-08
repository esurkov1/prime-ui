/**
 * Library bundle via esbuild (no Rollup/treeshake pass that breaks CSS Modules).
 * JS: `src/index.ts` → `dist/index.js`, `src/color-picker.ts` → `dist/color-picker.js`, shared code
 * in `dist/chunks/`. CSS: the base layer (`src/styles/globals.css`: tokens, themes, focus ring,
 * reduced motion) followed by every component module → `dist/index.css` (`prime-ui-kit/bundle.css`). Types: `tsc --emitDeclarationOnly` → `.dts-stage`, merged into `dist/`.
 */

import { spawn } from "node:child_process";
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });

/*
 * Two JS entries: `prime-ui-kit` and `prime-ui-kit/color-picker` (the only code on react-aria).
 * Splitting puts the shared modules in chunks, so both entries use one copy of every context. A
 * third, temporary entry imports both: one build keeps CSS Module class names identical, and its
 * CSS (every component) becomes `bundle.css`; the per-entry CSS files are dropped.
 */
const allEntry = resolve(root, ".bundle-all.ts");
await writeFile(allEntry, 'export * from "./src/index";\nexport * from "./src/color-picker";\n');
try {
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [
      { in: "src/index.ts", out: "index" },
      { in: "src/color-picker.ts", out: "color-picker" },
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
  });
} finally {
  await rm(allEntry, { force: true });
}
await rm(resolve(dist, "all.js"), { force: true });
await rm(resolve(dist, "color-picker.css"), { force: true });

const base = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/styles/globals.css"],
  bundle: true,
  write: false,
  logLevel: "warning",
});
await writeFile(
  resolve(dist, "index.css"),
  base.outputFiles[0].text + (await readFile(resolve(dist, "all.css"), "utf8")),
);
await rm(resolve(dist, "all.css"), { force: true });

const stage = resolve(root, ".dts-stage");
await rm(stage, { recursive: true, force: true });
const tscJs = resolve(root, "node_modules/typescript/lib/tsc.js");
const code = await new Promise<number>((res, rej) => {
  const child = spawn(process.execPath, [tscJs, "-p", "tsconfig.dts.json"], {
    cwd: root,
    stdio: "inherit",
  });
  child.on("error", rej);
  child.on("exit", (c) => res(c ?? 1));
});
if (code !== 0) throw new Error(`tsc emitDeclarationOnly failed with exit code ${code}`);
await cp(resolve(stage, "src"), dist, { recursive: true });
await cp(resolve(stage, "tokens"), resolve(dist, "tokens"), { recursive: true });
await rm(stage, { recursive: true, force: true });
