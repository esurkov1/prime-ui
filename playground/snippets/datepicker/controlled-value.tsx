import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerControlledValueSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const triggerLabel = value ? format(value, "d MMMM yyyy", { locale: ru }) : "Выбрать дату";

  return (
    <ExampleSurface>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            {triggerLabel}
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Datepicker.Shell>
            <Datepicker.Calendar
              locale={ru}
              mode="single"
              month={new Date(2026, 2, 1)}
              numberOfMonths={1}
              selected={value}
              onSelect={(d) => {
                setValue(d);
                if (d) setOpen(false);
              }}
            />
            <Datepicker.Value as="p">
              {value
                ? format(value, "d MMMM yyyy, EEEE", { locale: ru })
                : "Дата не выбрана — кликните по ячейке."}
            </Datepicker.Value>
          </Datepicker.Shell>
        </Popover.Content>
      </Popover.Root>
    </ExampleSurface>
  );
}
