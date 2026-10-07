/** A required, invalid group with option descriptions and one error under the last option. Use it to validate a one-of-many choice in a form. */
import { Radio, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function RadioHintErrorExample() {
  const labelId = React.useId();

  return (
    <div className={styles.field}>
      <Typography.Root id={labelId} variant="body-s" weight="medium" tone="secondary">
        Способ оплаты
      </Typography.Root>
      <Radio.Group name="payment" required invalid aria-labelledby={labelId}>
        <Radio.Root value="card">
          <Radio.Label>Банковская карта</Radio.Label>
          <Radio.Hint>Списание сразу после подтверждения заказа.</Radio.Hint>
        </Radio.Root>
        <Radio.Root value="invoice">
          <Radio.Label>Счёт для юрлица</Radio.Label>
          <Radio.Hint>Реквизиты придут на почту в течение рабочего дня.</Radio.Hint>
          <Radio.Error>Выберите способ оплаты, чтобы оформить заказ.</Radio.Error>
        </Radio.Root>
      </Radio.Group>
    </div>
  );
}
