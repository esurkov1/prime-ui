/** In a narrow column a long line scrolls inside the block and never wraps; Tab, then arrow keys. */
import { CodeBlock } from "prime-ui-kit";

import styles from "./examples.module.css";

const LONG_LINE = `docker run --rm -e NODE_ENV=production -p 8080:8080 -v "$(pwd)/data:/app/data" registry.example.com/billing-api:latest --config /app/data/config.yml`;

export default function CodeBlockNarrowExample() {
  return (
    <div className={styles.narrow}>
      <CodeBlock code={LONG_LINE} aria-label="Команда запуска контейнера" />
    </div>
  );
}
