/** `soft` (default) is a sunken panel with padding and the `code` text role; `ghost` is a bare `pre` that takes type and background from a host panel. Use `ghost` only inside your own panel. */

import { CodeBlock, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SAMPLE = `export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(value);
}`;

export default function CodeBlockVariantsExample() {
  return (
    <div className={styles.grid}>
      <div className={styles.cell}>
        <Typography.Root variant="caption" tone="muted">
          variant=&quot;soft&quot;
        </Typography.Root>
        <CodeBlock.Root code={SAMPLE} />
      </div>
      <div className={styles.cell}>
        <Typography.Root variant="caption" tone="muted">
          variant=&quot;ghost&quot; внутри своей панели
        </Typography.Root>
        <Typography.Root as="div" variant="caption" className={styles.host}>
          <CodeBlock.Root code={SAMPLE} variant="ghost" />
        </Typography.Root>
      </div>
    </div>
  );
}
