/** Short options laid out in a wrapping row with orientation="horizontal". Use it for 2–4 short labels without descriptions. */
import { Radio, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function RadioHorizontalExample() {
  const labelId = React.useId();

  return (
    <div className={styles.field}>
      <Typography.Root id={labelId} variant="body-s" weight="medium" tone="secondary">
        Период отчёта
      </Typography.Root>
      <Radio.Group
        name="period"
        defaultValue="week"
        orientation="horizontal"
        aria-labelledby={labelId}
      >
        <Radio.Root value="week">
          <Radio.Label>Неделя</Radio.Label>
        </Radio.Root>
        <Radio.Root value="month">
          <Radio.Label>Месяц</Radio.Label>
        </Radio.Root>
        <Radio.Root value="quarter">
          <Radio.Label>Квартал</Radio.Label>
        </Radio.Root>
      </Radio.Group>
    </div>
  );
}
