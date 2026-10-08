/** An API response sample on a filled panel, named for screen readers — `code`, `aria-label`. */
import { CodeBlock } from "prime-ui-kit";

import styles from "./examples.module.css";

const RESPONSE = `{
  "id": "ord_8f2a",
  "total": 14990,
  "currency": "RUB",
  "items": [{ "sku": "sku-12", "qty": 2 }]
}`;

export default function CodeBlockOverviewExample() {
  return (
    <div className={styles.column}>
      <CodeBlock code={RESPONSE} aria-label="Пример ответа GET /orders/:id" />
    </div>
  );
}
