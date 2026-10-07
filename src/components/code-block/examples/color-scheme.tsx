/** Without `colorScheme` the block follows the page theme; `light` / `dark` fix the scheme for the block only. Use a fixed scheme for a code sample that must look the same in both themes. */

import { CodeBlock, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SAMPLE = `const retries = 3; // повторы при ошибке сети
export const isReady = (status: "idle" | "busy") => status === "idle";`;

export default function CodeBlockColorSchemeExample() {
  return (
    <div className={styles.grid}>
      <div className={styles.cell}>
        <Typography.Root variant="caption" tone="muted">
          colorScheme=&quot;light&quot;
        </Typography.Root>
        <CodeBlock.Root code={SAMPLE} colorScheme="light" />
      </div>
      <div className={styles.cell}>
        <Typography.Root variant="caption" tone="muted">
          colorScheme=&quot;dark&quot;
        </Typography.Root>
        <CodeBlock.Root code={SAMPLE} colorScheme="dark" />
      </div>
    </div>
  );
}
