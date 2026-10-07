/** Palette hues in `soft` (default) and `outline`, with and without the remove button. Use a hue to group tags by category; keep `gray` for plain values. */
import { type PaletteColor, Tag, Typography } from "prime-ui-kit";

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

export default function TagColorsExample() {
  return (
    <div className={styles.matrix}>
      <Typography.Root as="span" variant="caption" tone="muted">
        soft
      </Typography.Root>
      <div className={styles.tags}>
        {colors.map((color) => (
          <Tag.Root
            key={color}
            color={color}
            labels={{ remove: `Убрать «${color}»` }}
            onRemove={() => undefined}
          >
            {color}
          </Tag.Root>
        ))}
      </div>
      <Typography.Root as="span" variant="caption" tone="muted">
        outline
      </Typography.Root>
      <div className={styles.tags}>
        {colors.map((color) => (
          <Tag.Root key={color} variant="outline" color={color}>
            {color}
          </Tag.Root>
        ))}
      </div>
    </div>
  );
}
