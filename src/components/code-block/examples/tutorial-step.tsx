import { CodeBlock, Typography } from "prime-ui-kit";

const STEP_CODE = `import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN((c) => c + 1)}>
      Счёт: {n}
    </button>
  );
}
`;

/** Шаг туториала: короткий контекст в Typography и код ниже. */
export default function CodeBlockTutorialStep() {
  return (
    <div>
      <Typography.Root variant="body-small" weight="semibold" as="p">
        Шаг 3 — счётчик на состоянии
      </Typography.Root>
      <Typography.Root variant="body-compact" tone="muted" as="p">
        Добавьте компонент и вызовите setN в обработчике клика.
      </Typography.Root>
      <CodeBlock.Root code={STEP_CODE} colorScheme="light" />
    </div>
  );
}
