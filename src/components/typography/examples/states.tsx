/** Text has no interactive states; this shows the one boolean style axis, `italic`, on the same variant and weight. Use italic for quotes and titles of works. */
import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyStatesExample() {
  return (
    <div className={styles.scaleList}>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" weight="medium">
          Обычный текст без курсива.
        </Typography.Root>
        <Divider align="start">italic не задан (false)</Divider>
      </div>
      <div className={styles.scaleRow}>
        <Typography.Root variant="body-m" weight="medium" italic>
          Тот же размер и вес с курсивом — цитата или название научной работы.
        </Typography.Root>
        <Divider align="start">italic — курсив через data-атрибут и токены</Divider>
      </div>
    </div>
  );
}
