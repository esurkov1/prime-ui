/** One `variant="body-m"` line with each `weight`, the extreme `tracking` values and `tone="secondary"`. Use to see how the override props change a role. */
import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const line = "Съешь же ещё этих мягких французских булок да выпей чаю";

export default function TypographyVariantsExample() {
  return (
    <div className={styles.scaleList}>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" weight="regular">
          {line}
        </Typography.Root>
        <Divider.Root align="start">weight regular</Divider.Root>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" weight="medium">
          {line}
        </Typography.Root>
        <Divider.Root align="start">weight medium</Divider.Root>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" weight="semibold">
          {line}
        </Typography.Root>
        <Divider.Root align="start">weight semibold</Divider.Root>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" tracking="tighter">
          {line}
        </Typography.Root>
        <Divider.Root align="start">tracking tighter</Divider.Root>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" tracking="wide">
          {line}
        </Typography.Root>
        <Divider.Root align="start">tracking wide</Divider.Root>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" tone="secondary">
          {line}
        </Typography.Root>
        <Divider.Root align="start">tone secondary — вторичный цвет текста</Divider.Root>
      </div>
    </div>
  );
}
