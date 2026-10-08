/** A date picked in a bottom sheet: a grab handle on top, a swipe down or a pick closes it — `side`, `Drawer.Body`. */
import { Button, Datepicker, Drawer, Icon } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FORMAT = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default function DrawerDateSheetExample() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 2, 8));

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="field.calendar" />
          </Button.Icon>
          {date ? `Отгрузка ${FORMAT.format(date)}` : "Дата отгрузки"}
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content side="bottom">
        <Drawer.Header>
          <Drawer.Title>Дата отгрузки</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Datepicker.Panel
            mode="single"
            className={styles.calendar}
            value={date}
            onValueChange={(next) => {
              setDate(next);
              setOpen(false);
            }}
          />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
