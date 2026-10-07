/** The three treatments (`soft` default, `solid`, `outline`) on the same hues, plus a leading `Badge.Dot`. Use to choose emphasis for labels in lists and tables. */

import { Badge, type PaletteColor, Typography } from "prime-ui-kit";
import { Fragment } from "react";

import styles from "./examples.module.css";

const variants = ["soft", "solid", "outline"] as const;
const colors: PaletteColor[] = ["gray", "blue", "green", "orange", "red"];

export default function BadgeVariantsExample() {
  return (
    <div className={styles.matrix}>
      {variants.map((variant) => (
        <Fragment key={variant}>
          <Typography.Root as="span" variant="caption" tone="muted">
            {variant}
          </Typography.Root>
          <div className={styles.badges}>
            {colors.map((color) => (
              <Badge.Root key={color} variant={variant} color={color}>
                {color}
              </Badge.Root>
            ))}
          </div>
        </Fragment>
      ))}
      <Typography.Root as="span" variant="caption" tone="muted">
        dot
      </Typography.Root>
      <div className={styles.badges}>
        <Badge.Root color="green">
          <Badge.Dot />
          Активен
        </Badge.Root>
        <Badge.Root color="yellow">
          <Badge.Dot />
          На проверке
        </Badge.Root>
        <Badge.Root color="red">
          <Badge.Dot />
          Отклонён
        </Badge.Root>
      </div>
    </div>
  );
}
