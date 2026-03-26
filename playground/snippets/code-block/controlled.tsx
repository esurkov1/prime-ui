import { useState } from "react";

import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

import styles from "./code-block-demos.module.css";

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
    <div className={styles.controlledRoot}>
      <div className="previewRowWrap">
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
      <p className={styles.controlledMeta}>
        Активный фрагмент: <strong>{label}</strong> (проп <code>code</code> из состояния).
      </p>
      <div className={styles.controlledCodeWrap}>
        <CodeBlock.Root code={code} colorScheme={scheme} />
      </div>
    </div>
  );
}
