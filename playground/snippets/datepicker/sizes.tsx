import { ru } from "date-fns/locale";

import { Datepicker, type DatepickerSize } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./sizes.module.css";

const SIZES: DatepickerSize[] = ["s", "m", "l", "xl"];

export default function DatepickerSizesSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {SIZES.map((size) => (
          <div key={`single-${size}`} className={styles.item}>
            <p className={styles.label}>{size.toUpperCase()}</p>
            <ExampleSurface>
              <Datepicker.Shell size={size}>
                <Datepicker.Calendar
                  locale={ru}
                  mode="single"
                  month={new Date(2026, 2, 1)}
                  selected={new Date(2026, 2, 11)}
                  size={size}
                />
              </Datepicker.Shell>
            </ExampleSurface>
          </div>
        ))}
      </div>
    </div>
  );
}
