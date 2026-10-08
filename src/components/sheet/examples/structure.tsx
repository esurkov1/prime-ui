/** The content alone: a date sheet with no header and no footer, the calendar across its width, named by `aria-label`; a pick or a swipe down closes it — `aria-label`, `Sheet.Body`. */
import { Button, Datepicker, Icon, Sheet } from "prime-ui-kit";
import * as React from "react";

const FORMAT = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export default function SheetStructureExample() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 2, 8));

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="field.calendar" />
          </Button.Icon>
          {date ? `Отгрузка ${FORMAT.format(date)}` : "Дата отгрузки"}
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content aria-label="Дата отгрузки">
        <Sheet.Body>
          <Datepicker.Panel
            mode="single"
            value={date}
            onValueChange={(next) => {
              setDate(next);
              setOpen(false);
            }}
          />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}
