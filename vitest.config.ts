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
    },
  },
  test: {
    /** Тяжёлый jsdom + много файлов: без лимита на машинах с большим числом CPU воркеры иногда не успевают стартовать (Vitest: «Timeout waiting for worker to respond»), отдельные тесты падают по testTimeout. */
    maxWorkers: 4,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/components/**", "src/hooks/**", "src/internal/**"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**", "src/types/**"],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
