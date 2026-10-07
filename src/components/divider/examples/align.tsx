/** The label at the start, the center or the end of the line; `start` heads a section — `align`. */
import { Divider } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DividerAlignExample() {
  return (
    <div className={styles.column}>
      <Divider align="start">Уведомления</Divider>
      <Divider>Сегодня</Divider>
      <Divider align="end">Конец истории</Divider>
    </div>
  );
}
