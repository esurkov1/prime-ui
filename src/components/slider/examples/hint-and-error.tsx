/** A slider framed like every field: required marker, a hint, and an error in its place — `required`, `hint`, `error`, `optional`. */
import { Slider } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SliderHintAndErrorExample() {
  const [budget, setBudget] = React.useState(80);

  return (
    <div className={styles.column}>
      <Slider
        label="Бюджет кампании, тыс. ₽"
        required
        showValue
        min={0}
        max={200}
        step={10}
        value={budget}
        onValueChange={setBudget}
        hint="Не больше 150 тыс. ₽ без согласования"
        error={budget > 150 ? "Нужно согласование финансового отдела" : undefined}
      />
      <Slider
        label="Доля показов в выходные, %"
        optional
        showValue
        defaultValue={30}
        hint="По умолчанию показы распределяются равномерно"
      />
    </div>
  );
}
