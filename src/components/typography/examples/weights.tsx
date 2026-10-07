/** One role with its weight, tracking or italic overridden — `weight`, `tracking`, `italic`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const LINE = "Отчёт по выручке за первый квартал";

export default function TypographyWeightsExample() {
  return (
    <div className={styles.stack}>
      <Typography.Root variant="body-m" weight="regular">
        {LINE} · regular
      </Typography.Root>
      <Typography.Root variant="body-m" weight="medium">
        {LINE} · medium
      </Typography.Root>
      <Typography.Root variant="body-m" weight="semibold">
        {LINE} · semibold
      </Typography.Root>
      <Typography.Root variant="body-m" tracking="tighter">
        {LINE} · tracking tighter
      </Typography.Root>
      <Typography.Root variant="body-m" tracking="wide">
        {LINE} · tracking wide
      </Typography.Root>
      <Typography.Root variant="body-m" italic>
        {LINE} · italic
      </Typography.Root>
    </div>
  );
}
