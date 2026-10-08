/**
 * Library bundle via esbuild (no Rollup/treeshake pass that breaks CSS Modules).
 * JS: `src/index.ts` → `dist/index.js`. CSS: the base layer (`src/styles/globals.css`: tokens,
 * themes, focus ring, reduced motion) followed by every component module → `dist/index.css`
 * (`prime-ui-kit/bundle.css`). Types: `tsc --emitDeclarationOnly` → `.dts-stage`, merged into `dist/`.
 */

import { spawn } from "node:child_process";
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  tsconfig: "tsconfig.json",
  alias: { "@": resolve(root, "src") },
  packages: "external",
  logLevel: "info",
  loader: { ".module.css": "local-css" },
});

const base = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/styles/globals.css"],
  bundle: true,
  write: false,
  logLevel: "warning",
});
const componentsCss = resolve(dist, "index.css");
await writeFile(componentsCss, base.outputFiles[0].text + (await readFile(componentsCss, "utf8")));

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
