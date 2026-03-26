import { format, startOfTomorrow } from "date-fns";
import { ru } from "date-fns/locale";
import { Button, Datepicker, Popover } from "prime-ui-kit";
import * as React from "react";

/**
 * Дата рождения: один день, будущие даты отключены, подпись в масштабе пикера.
 */
export function BirthdateSingleExample() {
  const [value, setValue] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const triggerLabel = value
    ? format(value, "d MMMM yyyy", { locale: ru })
    : "Укажите дату рождения";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          {triggerLabel}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetPadding="none" side="bottom">
        <Datepicker.Shell>
          <Datepicker.Calendar
            disabled={(date) => date >= startOfTomorrow()}
            locale={ru}
            mode="single"
            month={value ?? new Date(2000, 0, 1)}
            selected={value}
            onSelect={(d) => {
              setValue(d);
            }}
          />
          <Datepicker.Value as="p">
            {value ? format(value, "d MMMM yyyy", { locale: ru }) : "Выберите день в сетке."}
          </Datepicker.Value>
        </Datepicker.Shell>
      </Popover.Content>
    </Popover.Root>
  );
}
