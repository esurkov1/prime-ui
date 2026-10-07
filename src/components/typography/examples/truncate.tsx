/** `truncate` clamps a block to one line with an ellipsis; `title` keeps the full text available. Use for names and titles in fixed-width cells, cards and list rows. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const name = "Эргономичное кресло с подголовником и поддержкой поясницы";

export default function TypographyTruncateExample() {
  return (
    <div className={styles.truncateBox}>
      <Typography.Root variant="title-s" truncate title={name}>
        {name}
      </Typography.Root>
      <Typography.Root variant="body-s" tone="muted">
        Артикул 48 213
      </Typography.Root>
    </div>
  );
}
