/**
 * Library JS/CSS bundle via esbuild (no Rollup/treeshake pass that breaks CSS Modules).
 * Types: `tsc --emitDeclarationOnly` → `.dts-stage`, then merged into `dist/` (see `tsconfig.dts.json`).
 */

import { spawn } from "node:child_process";
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const watch = process.argv.includes("--watch");

if (!watch) {
  await rm(resolve(root, "dist"), { recursive: true, force: true });
}

const buildOptions: esbuild.BuildOptions = {
  absWorkingDir: root,
  entryPoints: ["src/index.ts", "src/components/index.ts"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  splitting: false,
  sourcemap: true,
  tsconfig: "tsconfig.json",
  alias: { "@": resolve(root, "src") },
  packages: "external",
  logLevel: "info",
  loader: {
    ".aac": "file",
    // `file` treats the import as removable; `css` keeps globals and @import chain in the bundle.
    ".css": "css",
    ".eot": "file",
    ".flac": "file",
    ".gif": "file",
    ".jpeg": "file",
    ".jpg": "file",
    ".mp3": "file",
    ".mp4": "file",
    ".ogg": "file",
    ".otf": "file",
    ".png": "file",
    ".svg": "file",
    ".ttf": "file",
    ".wav": "file",
    ".webm": "file",
    ".webp": "file",
    ".woff": "file",
    ".woff2": "file",
    ".module.css": "local-css",
  },
};

async function emitAndMergeDts(): Promise<void> {
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
  if (code !== 0) {
    throw new Error(`tsc emitDeclarationOnly failed with exit code ${code}`);
  }

  const dist = resolve(root, "dist");
  await cp(resolve(stage, "src"), dist, { recursive: true });
  await cp(resolve(stage, "tokens"), resolve(dist, "tokens"), { recursive: true });
  await rm(stage, { recursive: true, force: true });

  const indexDts = resolve(dist, "index.d.ts");
  let body = await readFile(indexDts, "utf8");
  if (body.startsWith('import "./styles/globals.css";\r\n')) {
    body = body.slice('import "./styles/globals.css";\r\n'.length);
  } else if (body.startsWith('import "./styles/globals.css";\n')) {
    body = body.slice('import "./styles/globals.css";\n'.length);
  }
  await writeFile(indexDts, body);
}

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("[bundle-lib] watching src for changes…");
} else {
  await esbuild.build(buildOptions);
  await emitAndMergeDts();
}
