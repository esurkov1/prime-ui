import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./sizes.module.css";

const FIXED_MONTH = new Date(2026, 2, 1);

export default function DatepickerVariantsModesSnippet() {
  const [single, setSingle] = React.useState<Date | undefined>(() => new Date(2026, 2, 11));
  const [range, setRange] = React.useState<DateRange | undefined>(() => ({
    from: new Date(2026, 2, 5),
    to: new Date(2026, 2, 18),
  }));
  const [openSingle, setOpenSingle] = React.useState(false);
  const [openRange, setOpenRange] = React.useState(false);

  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <p className={styles.label}>Одна дата</p>
        <ExampleSurface>
          <Popover.Root open={openSingle} onOpenChange={setOpenSingle}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" variant="neutral">
                Режим single
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" side="bottom">
              <Datepicker.Shell>
                <Datepicker.Calendar
                  locale={ru}
                  mode="single"
                  month={FIXED_MONTH}
                  numberOfMonths={1}
                  selected={single}
                  onSelect={setSingle}
                />
              </Datepicker.Shell>
            </Popover.Content>
          </Popover.Root>
        </ExampleSurface>
      </div>
      <div className={styles.item}>
        <p className={styles.label}>Диапазон</p>
        <ExampleSurface>
          <Popover.Root open={openRange} onOpenChange={setOpenRange}>
            <Popover.Trigger asChild>
              <Button.Root mode="stroke" variant="neutral">
                Режим range
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content align="start" side="bottom">
              <Datepicker.Shell>
                <Datepicker.Calendar
                  locale={ru}
                  mode="range"
                  month={FIXED_MONTH}
                  numberOfMonths={1}
                  selected={range}
                  onSelect={setRange}
                />
              </Datepicker.Shell>
            </Popover.Content>
          </Popover.Root>
        </ExampleSurface>
      </div>
    </div>
  );
}
