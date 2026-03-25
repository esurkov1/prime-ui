import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

const LONG_LINE = `docker run --rm -e NODE_ENV=production -p 8080:8080 -v "$(pwd)/data:/app/data" registry.example.com/billing-api:latest --config /app/data/config.yml
`;

/** Узкая колонка и горизонтальная прокрутка: блок на всю ширину контейнера через обёртку и className. */
export default function CodeBlockFullWidthSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div style={{ width: "100%", maxWidth: "min(100%, 20rem)" }}>
      <p style={{ margin: "0 0 var(--prime-sys-spacing-x1)", fontSize: 13, opacity: 0.85 }}>
        Контейнер уже узкий — длинная строка уезжает в scroll.
      </p>
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "var(--prime-sys-radius-m)",
          border: "1px solid var(--prime-sys-color-border-muted)",
          background: "var(--prime-sys-color-surface-raised)",
          padding: "var(--prime-sys-spacing-x2)",
          boxSizing: "border-box",
        }}
      >
        <CodeBlock.Root code={LONG_LINE} colorScheme={scheme} className="codeBlockFullBleed" />
      </div>
    </div>
  );
}
