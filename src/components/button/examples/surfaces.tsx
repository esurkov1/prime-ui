/** Neutral solid, soft and ghost buttons for checking contrast on canvas, card, raised layer and accent backgrounds. Use when buttons sit on a non-default surface. */
import { Button } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonSurfacesExample() {
  return (
    <div className={styles.row}>
      <Button.Root tone="neutral">Отмена</Button.Root>
      <Button.Root variant="soft" tone="neutral">
        Фильтры
      </Button.Root>
      <Button.Root variant="ghost" tone="neutral">
        Ещё
      </Button.Root>
    </div>
  );
}
