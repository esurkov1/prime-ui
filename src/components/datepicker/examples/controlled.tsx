/** A report filter owns the period: quick buttons set it from outside, the field shows it — `value`, `onValueChange`. */
import { Button, Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TODAY = new Date(2026, 9, 7);
const LAST_WEEK: DatepickerRange = {
  from: new Date(2026, 8, 30),
  to: new Date(2026, 9, 6, 23, 59, 59, 999),
};
const NO_PERIOD: DatepickerRange = { from: null, to: null };

export default function DatepickerControlledExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>(LAST_WEEK);

  return (
    <>
      <Datepicker.Root
        mode="range"
        label="Период отчёта"
        value={period}
        onValueChange={setPeriod}
        today={TODAY}
        months={2}
        placeholder="Выбрать период"
        fullWidth
      />
      <div className={styles.actions}>
        <Button.Root variant="soft" tone="neutral" size="s" onClick={() => setPeriod(LAST_WEEK)}>
          Прошлая неделя
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => setPeriod(NO_PERIOD)}>
          Сбросить
        </Button.Root>
      </div>
    </>
  );
}
