/** A leave request form: a required period that turns into an error after submit and an optional return date — `required`, `error`, `optional`. */
import { Button, Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DatepickerInFormExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>({ from: null, to: null });
  const [submitted, setSubmitted] = React.useState(false);
  const missing = submitted && (!period.from || !period.to);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Datepicker.Root
        mode="range"
        label="Период отпуска"
        required
        hint="Не больше 28 дней подряд"
        error={missing ? "Укажите начало и конец отпуска" : undefined}
        value={period}
        onValueChange={setPeriod}
        months={2}
        footer
        placeholder="Выбрать период"
        fullWidth
      />
      <Datepicker.Root mode="single" label="Выход на работу" optional fullWidth />
      <div className={styles.actions}>
        <Button.Root variant="ghost" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root type="submit">Отправить заявку</Button.Root>
      </div>
    </form>
  );
}
