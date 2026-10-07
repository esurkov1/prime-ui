import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The root is `playground/`, so Vite's watcher does not see files added to or removed from `src/`
 * (examples arrive by `import.meta.glob`). Watching `src/` keeps the example registry live: a new
 * or deleted example shows up without restarting the dev server.
 */
function watchKitSources(): Plugin {
  return {
    name: "prime-watch-kit-sources",
    configureServer(server) {
      server.watcher.add(path.resolve(rootDir, "src"));
    },
  };
}

export default defineConfig({
  root: path.resolve(rootDir, "playground"),
  plugins: [react(), watchKitSources()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "prime-ui-kit": path.resolve(rootDir, "src/index.ts"),
    },
  },
});
