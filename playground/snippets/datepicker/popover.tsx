import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";

export default function DatepickerPopoverSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    setValue(date);
    if (date) setOpen(false);
  };

  const label = value ? format(value, "d MMMM yyyy", { locale: ru }) : "Выберите дату";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" variant="neutral">
          <Button.Icon>
            <CalendarDays aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          {label}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Datepicker.Shell>
          <Datepicker.Calendar
            locale={ru}
            mode="single"
            responsiveMonths
            selected={value}
            onSelect={handleSelect}
          />
        </Datepicker.Shell>
      </Popover.Content>
    </Popover.Root>
  );
}
