/** A hand-built field (Label + Select + Hint) in default, error and disabled states; the hint id goes to the trigger's `aria-describedby`. Use it for controls without `hint`/`error` props. */
import { Hint, Label, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type FieldState = "default" | "error" | "disabled";

const HINT_TEXT: Record<FieldState, string> = {
  default: "Отчёты придут в начале периода.",
  error: "Выберите периодичность отчётов.",
  disabled: "Доступно на тарифе «Бизнес».",
};

function ReportField({ state }: { state: FieldState }) {
  const labelId = React.useId();
  const hintId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root id={labelId} disabled={state === "disabled"}>
        Периодичность
      </Label.Root>
      <div className={styles.fieldBody}>
        <Select.Root
          invalid={state === "error"}
          placeholder="Не выбрано"
          defaultValue={state === "default" ? "week" : undefined}
          disabled={state === "disabled"}
        >
          <Select.Trigger aria-labelledby={labelId} aria-describedby={hintId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="week">Раз в неделю</Select.Item>
            <Select.Item value="month">Раз в месяц</Select.Item>
          </Select.Content>
        </Select.Root>
        <Hint.Root
          id={hintId}
          invalid={state === "error"}
          disabled={state === "disabled"}
          role={state === "error" ? "alert" : undefined}
        >
          {HINT_TEXT[state]}
        </Hint.Root>
      </div>
    </div>
  );
}

export default function HintFieldStatesExample() {
  return (
    <div className={styles.fields}>
      <ReportField state="default" />
      <ReportField state="error" />
      <ReportField state="disabled" />
    </div>
  );
}
