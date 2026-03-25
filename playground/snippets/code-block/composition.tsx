import { CodeBlock } from "@/components/code-block/CodeBlock";
import { Typography } from "@/components/typography/Typography";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

const SAMPLE = `{
  "id": "ord_8f2a",
  "total": 14990,
  "currency": "RUB",
  "items": [{ "sku": "sku-12", "qty": 2 }]
}
`;

/** Блок документации: заголовок Typography и ниже фрагмент JSON с подсветкой. */
export default function CodeBlockCompositionSnippet() {
  const { scheme } = usePlaygroundTheme();
  return (
    <div
      style={{
        maxWidth: "min(100%, 28rem)",
        padding: "var(--prime-sys-spacing-x3)",
        borderRadius: "var(--prime-sys-radius-l)",
        border: "1px solid var(--prime-sys-color-border-muted)",
        background: "var(--prime-sys-color-surface-raised)",
        display: "grid",
        gap: "var(--prime-sys-spacing-x2)",
      }}
    >
      <Typography.Root size="s" weight="semibold" as="div">
        Тело ответа: GET /orders/:id
      </Typography.Root>
      <Typography.Root size="xs" tone="muted" as="p" style={{ margin: 0 }}>
        Пример успешного ответа для интеграции склада.
      </Typography.Root>
      <div
        style={{
          fontSize: "var(--prime-sys-typography-control-s)",
          lineHeight: "var(--prime-sys-typography-lineHeight-normal)",
          padding: "var(--prime-sys-spacing-x2)",
          borderRadius: "var(--prime-sys-radius-m)",
          background: "var(--prime-sys-color-surface-accentSoft)",
        }}
      >
        <CodeBlock.Root code={SAMPLE} colorScheme={scheme} />
      </div>
    </div>
  );
}
