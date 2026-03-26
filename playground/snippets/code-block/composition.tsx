import { CodeBlock } from "@/components/code-block/CodeBlock";
import { Typography } from "@/components/typography/Typography";

import { usePlaygroundTheme } from "../../components/PlaygroundTheme";

import styles from "./code-block-demos.module.css";

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
    <div className={styles.docCard}>
      <Typography.Root size="s" weight="semibold" as="div">
        Тело ответа: GET /orders/:id
      </Typography.Root>
      <Typography.Root size="xs" tone="muted" as="p">
        Пример успешного ответа для интеграции склада.
      </Typography.Root>
      <div className={styles.codeDemoNested}>
        <CodeBlock.Root code={SAMPLE} colorScheme={scheme} />
      </div>
    </div>
  );
}
