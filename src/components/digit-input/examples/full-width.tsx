/** Cells that share the container width and keep the tier height, above a full-width button — `fullWidth`. */
import { Button, DigitInput } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DigitInputFullWidthExample() {
  return (
    <div className={styles.panel}>
      <DigitInput label="Код из SMS" length={6} fullWidth />
      <Button.Root fullWidth>Подтвердить</Button.Root>
    </div>
  );
}
