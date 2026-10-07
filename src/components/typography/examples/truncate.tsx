/** A long product name clamped to one line with an ellipsis; the full text stays in the tooltip — `truncate`, `title`. */
import { Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const NAME = "Эргономичное кресло с подголовником и поддержкой поясницы";

export default function TypographyTruncateExample() {
  return (
    <div className={styles.truncateBox}>
      <Typography variant="title-s" truncate title={NAME}>
        {NAME}
      </Typography>
      <Typography variant="body-s" tone="muted">
        Артикул 48 213
      </Typography>
    </div>
  );
}
