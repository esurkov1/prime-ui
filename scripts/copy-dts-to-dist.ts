import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

await mkdir(resolve(root, "dist/components"), { recursive: true });
await copyFile(resolve(root, ".tsup-dts/index.d.ts"), resolve(root, "dist/index.d.ts"));
await copyFile(
  resolve(root, ".tsup-dts/components/index.d.ts"),
  resolve(root, "dist/components/index.d.ts"),
);
