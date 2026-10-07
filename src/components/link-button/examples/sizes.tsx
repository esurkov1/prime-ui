/** All five size tiers; text and icon come from the control tier (xs 12 · s 13 · m 14 · l 16 · xl 18). Use to match the link to the text or controls around it. */
import { LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes = ["xs", "s", "m", "l", "xl"] as const;

export default function LinkButtonSizesExample() {
  return (
    <div className={styles.sizeRow}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <LinkButton.Root href="#" size={size}>
            Подробнее
          </LinkButton.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
