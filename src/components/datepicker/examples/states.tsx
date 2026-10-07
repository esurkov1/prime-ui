/** Empty, filled, error and disabled fields with labels and hints. Use it as a reference for every field state. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DatepickerStatesExample() {
  const [filled, setFilled] = React.useState<Date | null>(new Date());
  const [range, setRange] = React.useState<DatepickerRange>({ from: null, to: null });

  return (
    <div className={styles.grid}>
      <Datepicker.Root mode="single" label="Пусто" hint="Плейсхолдер «Выбрать дату»" fullWidth />
      <Datepicker.Root
        mode="single"
        label="Выбрано"
        value={filled}
        onValueChange={setFilled}
        fullWidth
      />
      <Datepicker.Root
        mode="range"
        label="Ошибка"
        required
        error="Укажите период отпуска"
        value={range}
        onValueChange={setRange}
        placeholder="Выбрать период"
        fullWidth
      />
      <Datepicker.Root
        mode="single"
        label="Отключено"
        value={filled}
        onValueChange={setFilled}
        disabled
        fullWidth
      />
    </div>
  );
}
