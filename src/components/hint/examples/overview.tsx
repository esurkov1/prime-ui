/** Help text under a control without its own `hint` prop, linked to it by `id` and `aria-describedby`. */
import { DigitInput, Hint, Label } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintOverviewExample() {
  const hintId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root>Код из SMS</Label.Root>
      <DigitInput length={6} aria-describedby={hintId} />
      <Hint.Root id={hintId}>Код придёт на +7 900 ••• 12 34 в течение минуты.</Hint.Root>
    </div>
  );
}
