import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Datepicker } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./sizes.module.css";

const FIXED_MONTH = new Date(2026, 2, 1);

export default function DatepickerVariantsModesSnippet() {
  const [single, setSingle] = React.useState<Date | undefined>(() => new Date(2026, 2, 11));
  const [range, setRange] = React.useState<DateRange | undefined>(() => ({
    from: new Date(2026, 2, 5),
    to: new Date(2026, 2, 18),
  }));

  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <p className={styles.label}>Одна дата</p>
        <ExampleSurface>
          <Datepicker.Shell size="m">
            <Datepicker.Calendar
              locale={ru}
              mode="single"
              month={FIXED_MONTH}
              numberOfMonths={1}
              selected={single}
              onSelect={setSingle}
            />
          </Datepicker.Shell>
        </ExampleSurface>
      </div>
      <div className={styles.item}>
        <p className={styles.label}>Диапазон</p>
        <ExampleSurface>
          <Datepicker.Shell size="m">
            <Datepicker.Calendar
              locale={ru}
              mode="range"
              month={FIXED_MONTH}
              numberOfMonths={1}
              selected={range}
              onSelect={setRange}
            />
          </Datepicker.Shell>
        </ExampleSurface>
      </div>
    </div>
  );
}
