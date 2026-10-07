/** The parent owns the value and shares it with a number field for exact entry — `value`, `onValueChange`. */
import { Input, Slider } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX_DISCOUNT = 50;

export default function SliderControlledExample() {
  const [discount, setDiscount] = React.useState(15);

  return (
    <div className={styles.withInput}>
      <Slider
        label="Скидка для клиента"
        max={MAX_DISCOUNT}
        value={discount}
        onValueChange={setDiscount}
        formatValue={(value) => `${value}%`}
      />
      <Input.Root>
        <Input.Wrapper>
          <Input.Field
            type="number"
            min={0}
            max={MAX_DISCOUNT}
            aria-label="Скидка для клиента, %"
            value={discount}
            onValueChange={(text) => {
              const next = Number(text);
              if (!Number.isNaN(next)) setDiscount(Math.min(MAX_DISCOUNT, Math.max(0, next)));
            }}
          />
          <Input.InlineAffix side="end">%</Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
