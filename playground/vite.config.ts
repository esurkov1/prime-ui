import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The root is `playground/`, so Vite's watcher does not see files added to or removed from `src/`
 * and `SKILL/patterns/` (examples and patterns arrive by `import.meta.glob`). Watching them keeps
 * the registries live: a new or deleted file shows up without restarting the dev server.
 */
function watchKitSources(): Plugin {
  return {
    name: "prime-watch-kit-sources",
    configureServer(server) {
      server.watcher.add([path.resolve(rootDir, "src"), path.resolve(rootDir, "SKILL/patterns")]);
    },
  };
}

export default defineConfig({
  root: path.resolve(rootDir, "playground"),
  plugins: [react(), watchKitSources()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      // The subpath entry first: a plain `prime-ui-kit` key would also catch `prime-ui-kit/…`.
      "prime-ui-kit/color-picker": path.resolve(rootDir, "src/color-picker.ts"),
      "prime-ui-kit/icons": path.resolve(rootDir, "src/icon-set.ts"),
      "prime-ui-kit": path.resolve(rootDir, "src/index.ts"),
    },
  },
});
