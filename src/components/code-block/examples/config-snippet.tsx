import { CodeBlock } from "prime-ui-kit";

const CONFIG_TS = `// vite.config.ts — фрагмент
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: { outDir: "dist", sourcemap: true },
});
`;

/** Фрагмент конфигурации как TS-исходник (предпочтительный формат для подсветки кита). */
export default function CodeBlockConfigSnippet() {
  return <CodeBlock.Root code={CONFIG_TS} colorScheme="dark" />;
}
