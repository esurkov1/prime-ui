/** The block takes the column width and a long line scrolls inside it (Tab, then arrow keys). Use for shell commands and configs that must not wrap. */

import { CodeBlock } from "prime-ui-kit";

import styles from "./examples.module.css";

const LONG_LINE = `docker run --rm -e NODE_ENV=production -p 8080:8080 -v "$(pwd)/data:/app/data" registry.example.com/billing-api:latest --config /app/data/config.yml`;

export default function CodeBlockLongLinesExample() {
  return (
    <div className={styles.narrow}>
      <CodeBlock.Root code={LONG_LINE} aria-label="Команда запуска контейнера" />
    </div>
  );
}
