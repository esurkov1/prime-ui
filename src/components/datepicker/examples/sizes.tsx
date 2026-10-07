/** All five size tiers sharing one value: field height 28–48, day cell 24–40. Use it to line the field up with Input, Select and Button of the same size. */
import { Datepicker } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DatepickerSizesExample() {
  const [date, setDate] = React.useState<Date | null>(new Date());
  return (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <Datepicker.Root
          key={size}
          size={size}
          mode="single"
          value={date}
          onValueChange={setDate}
          aria-label={`Дата, размер ${size}`}
        />
      ))}
    </div>
  );
}
