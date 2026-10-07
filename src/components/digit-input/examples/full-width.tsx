/** `fullWidth`: the cells share the container width and keep the tier height, so a code fits a card or a narrow phone column without leaving empty margins. Use it in forms and cards where the code sits above a full-width button. */
import { Button, DigitInput } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DigitInputFullWidthExample() {
  return (
    <div className={styles.wide}>
      <DigitInput.Root length={6} size="l" fullWidth labels={{ group: "Код из SMS" }} />
      <DigitInput.Root length={4} size="m" fullWidth labels={{ group: "PIN-код" }} />
      <Button.Root size="l" fullWidth>
        Подтвердить
      </Button.Root>
    </div>
  );
}
