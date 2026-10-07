/** Removable tags in the five badge tiers: 16 · 20 · 24 · 28 · 32 px, default `m`. Use to match a tag to the density of its row. */
import { type ControlSize, Tag, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function TagSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Tag.Root labels={{ remove: "Убрать «Москва»" }} size={size} onRemove={() => undefined}>
            Москва
          </Tag.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
