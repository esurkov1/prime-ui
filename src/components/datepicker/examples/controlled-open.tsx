/** The parent owns the panel: a reminder button opens the calendar from code, a picked day closes it — `open`, `onOpenChange`. */
import { Button, Datepicker } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TODAY = new Date(2026, 9, 7);

export default function DatepickerControlledOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <>
      <Datepicker.Root
        mode="single"
        label="Дата отгрузки"
        value={date}
        onValueChange={setDate}
        open={open}
        onOpenChange={setOpen}
        today={TODAY}
        fullWidth
      />
      <div className={styles.actions}>
        <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
          Указать дату отгрузки
        </Button.Root>
      </div>
    </>
  );
}
