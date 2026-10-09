/** Help text under a hand-built field, linked to its input by `id` and `aria-describedby`. */
import { Hint, Input, Label } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function HintOverviewExample() {
  const inputId = React.useId();
  const hintId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root htmlFor={inputId}>ИНН компании</Label.Root>
      <Input.Root id={inputId}>
        <Input.Wrapper>
          <Input.Field inputMode="numeric" defaultValue="7707083893" aria-describedby={hintId} />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={hintId}>10 цифр для юрлица, 12 — для ИП.</Hint.Root>
    </div>
  );
}
