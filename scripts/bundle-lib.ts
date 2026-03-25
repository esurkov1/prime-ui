/**
 * Library JS/CSS bundle via esbuild (no tsup Rollup treeshake pass).
 * tsup’s tree-shaking step rewrites chunks and collapses CSS module default exports to `{}`.
 */

import { rm } from "node:fs/promises";
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
    ".css": "file",
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

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("[bundle-lib] watching src for changes…");
} else {
  await esbuild.build(buildOptions);
}
