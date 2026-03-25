import { defineConfig } from "tsup";

/** Declarations only; output must NOT be `dist` — `tsup --dts-only` overwrites `.js` there and breaks CSS modules. */
export default defineConfig({
  entry: ["src/index.ts", "src/components/index.ts"],
  format: ["esm"],
  dts: true,
  outDir: ".tsup-dts",
  clean: true,
});
