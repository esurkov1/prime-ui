import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      // Composition patterns (SKILL/patterns) import the kit by its package name.
      "prime-ui-kit": path.resolve(rootDir, "src/index.ts"),
    },
  },
  test: {
    /** Heavy jsdom and many files: without a cap, machines with many CPUs sometimes fail to start
     * workers in time ("Timeout waiting for worker to respond") and single tests hit testTimeout. */
    maxWorkers: 4,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
  },
});
