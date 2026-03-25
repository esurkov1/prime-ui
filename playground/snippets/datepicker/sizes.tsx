import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { Datepicker, type DatepickerSize } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./sizes.module.css";

const SIZES: DatepickerSize[] = ["s", "m", "l", "xl"];

function DatepickerSizePopover({ size }: { size: DatepickerSize }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Date | undefined>(() => new Date(2026, 2, 11));

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="s" variant="neutral">
          Размер {size.toUpperCase()}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Popover.Inset padding="none">
          <Datepicker.Shell size={size}>
            <Datepicker.Calendar
              locale={ru}
              mode="single"
              month={new Date(2026, 2, 1)}
              selected={value}
              size={size}
              onSelect={setValue}
            />
          </Datepicker.Shell>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}

export default function DatepickerSizesSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {SIZES.map((size) => (
          <div key={`single-${size}`} className={styles.item}>
            <p className={styles.label}>{size.toUpperCase()}</p>
            <ExampleSurface>
              <DatepickerSizePopover size={size} />
            </ExampleSurface>
          </div>
        ))}
      </div>
    </div>
  );
}
