/** API documentation fragment: a Typography heading and description, then a response sample with `aria-label`. Use for docs and integration guides. */

import { CodeBlock, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const RESPONSE = `{
  "id": "ord_8f2a",
  "total": 14990,
  "currency": "RUB",
  "items": [{ "sku": "sku-12", "qty": 2 }]
}`;

export default function CodeBlockApiDocsExample() {
  const titleId = React.useId();

  return (
    <section className={styles.doc} aria-labelledby={titleId}>
      <div className={styles.docText}>
        <Typography.Root as="h3" variant="title-s" id={titleId}>
          GET /orders/:id
        </Typography.Root>
        <Typography.Root as="p" variant="body-m" tone="secondary">
          Возвращает заказ со списком позиций. Сумма в копейках.
        </Typography.Root>
      </div>
      <CodeBlock.Root code={RESPONSE} aria-label="Пример ответа GET /orders/:id" />
    </section>
  );
}
