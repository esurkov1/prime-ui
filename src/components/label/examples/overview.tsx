/** A standalone label above a hand-built field, linked to its input through `htmlFor` and `id`. */
import { Input, Label } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LabelOverviewExample() {
  const inputId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root htmlFor={inputId}>Название проекта</Label.Root>
      <Input.Root id={inputId}>
        <Input.Wrapper>
          <Input.Field defaultValue="Редизайн личного кабинета" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
