/** All ten palette hues in `soft` (default) and `solid`. Use to pick a category color; the text must read without the color. */
import { Badge, type PaletteColor, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const colors: PaletteColor[] = [
  "gray",
  "blue",
  "sky",
  "teal",
  "green",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
];

export default function BadgePaletteExample() {
  return (
    <div className={styles.matrix}>
      <Typography.Root as="span" variant="caption" tone="muted">
        soft
      </Typography.Root>
      <div className={styles.badges}>
        {colors.map((color) => (
          <Badge.Root key={color} color={color}>
            {color}
          </Badge.Root>
        ))}
      </div>
      <Typography.Root as="span" variant="caption" tone="muted">
        solid
      </Typography.Root>
      <div className={styles.badges}>
        {colors.map((color) => (
          <Badge.Root variant="solid" key={color} color={color}>
            {color}
          </Badge.Root>
        ))}
      </div>
    </div>
  );
}
