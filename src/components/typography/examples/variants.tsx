import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const line = "Один размер `m`, разные оси оформления: `weight`, `tracking` и `tone`.";

/** `weight`, крайние `tracking` и `tone` на `variant="body-default"`. Зеркало `playground/snippets/typography/variants.tsx`. */
export default function TypographyExampleVariants() {
  return (
    <div className={styles.typographyScaleList}>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" weight="regular">
          {line} (regular)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight regular
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" weight="medium">
          {line} (medium)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight medium
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" weight="semibold">
          {line} (semibold)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight semibold
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" tracking="tighter">
          {line} (tracking tighter)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tracking tighter
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" tracking="wide">
          {line} (tracking wide)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tracking wide
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default" tone="muted">
          {line} (tone muted)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tone muted — вторичный цвет текста
        </Divider.Root>
      </div>
    </div>
  );
}
