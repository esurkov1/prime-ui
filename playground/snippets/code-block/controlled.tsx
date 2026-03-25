import { useState } from "react";

import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

const SNIPPETS: [string, string][] = [
  [
    "Утилита",
    `export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
`,
  ],
  [
    "React",
    `import { useMemo } from "react";

export function useStableId(prefix: string) {
  return useMemo(() => \`\${prefix}-\${Math.random().toString(36).slice(2)}\`, [prefix]);
}
`,
  ],
];

/** Строка для CodeBlock хранится в состоянии родителя: переключение вкладок меняет проп code. */
export default function CodeBlockControlledSnippet() {
  const { scheme } = usePlaygroundTheme();
  const [index, setIndex] = useState(0);
  const [label, code] = SNIPPETS[index] ?? SNIPPETS[0];

  return (
    <div
      style={{ display: "grid", gap: "var(--prime-sys-spacing-m)", maxWidth: "min(100%, 32rem)" }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--prime-sys-spacing-x2)" }}>
        {SNIPPETS.map(([title], i) => (
          <Button.Root
            key={title}
            type="button"
            variant={i === index ? "primary" : "neutral"}
            mode={i === index ? "filled" : "stroke"}
            size="s"
            onClick={() => setIndex(i)}
          >
            {title}
          </Button.Root>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
        Активный фрагмент: <strong>{label}</strong> (проп <code>code</code> из состояния).
      </p>
      <div
        style={{
          padding: "var(--prime-sys-spacing-x2)",
          borderRadius: "var(--prime-sys-radius-m)",
          border: "1px solid var(--prime-sys-color-border-muted)",
          background: "var(--prime-sys-color-surface-raised)",
          fontSize: "var(--prime-sys-typography-control-s)",
          lineHeight: "var(--prime-sys-typography-lineHeight-normal)",
        }}
      >
        <CodeBlock.Root code={code} colorScheme={scheme} />
      </div>
    </div>
  );
}
