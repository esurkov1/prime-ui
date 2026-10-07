/** A controlled slider sharing one value with a number input. Use it when users need both rough dragging and exact keyboard entry. */
import { Input, Slider } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MIN = 0;
const MAX = 100;

export default function SliderControlledExample() {
  const [discount, setDiscount] = React.useState(15);

  return (
    <div className={styles.column}>
      <div className={styles.withInput}>
        <Slider.Root
          label="Скидка"
          min={MIN}
          max={MAX}
          value={discount}
          onValueChange={setDiscount}
          formatValue={(v) => `${v}%`}
        />
        <Input.Root>
          <Input.Wrapper>
            <Input.Field
              type="number"
              min={MIN}
              max={MAX}
              aria-label="Скидка, %"
              value={discount}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (!Number.isNaN(next)) setDiscount(Math.min(MAX, Math.max(MIN, next)));
              }}
            />
            <Input.InlineAffix side="end">%</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
