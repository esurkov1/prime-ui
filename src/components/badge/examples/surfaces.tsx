/** A typical set of status badges that reads the same on canvas, card and floating layers. Use as-is on any surface; soft fills need no adjustment. */
import { Badge } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeSurfacesExample() {
  return (
    <div className={styles.badges}>
      <Badge.Root>Черновик</Badge.Root>
      <Badge.Root color="blue">Ревью</Badge.Root>
      <Badge.Root color="green">Опубликован</Badge.Root>
      <Badge.Root variant="outline" color="red">
        Ошибка
      </Badge.Root>
      <Badge.Root color="yellow">
        <Badge.Dot />
        На паузе
      </Badge.Root>
    </div>
  );
}
