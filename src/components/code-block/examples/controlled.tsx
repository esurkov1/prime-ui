import { ButtonGroup, CodeBlock, Typography } from "prime-ui-kit";
import { useState } from "react";

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

/** Проп `code` из состояния родителя: сегменты переключают два разных фрагмента (как в playground `controlled.tsx`). */
export default function CodeBlockControlledExample() {
  const [index, setIndex] = useState(0);
  const [label, code] = SNIPPETS[index] ?? SNIPPETS[0];

  return (
    <div>
      <Typography.Root variant="body-compact" tone="muted" as="p">
        Активный фрагмент: <strong>{label}</strong> (проп <code>code</code> из состояния).
      </Typography.Root>
      <ButtonGroup.Root size="s" aria-label="Выбор фрагмента кода">
        {SNIPPETS.map(([title], i) => (
          <ButtonGroup.Item key={title} pressed={i === index} onClick={() => setIndex(i)}>
            {title}
          </ButtonGroup.Item>
        ))}
      </ButtonGroup.Root>
      <CodeBlock.Root code={code} colorScheme="light" />
    </div>
  );
}
