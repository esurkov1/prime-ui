import { addDays, endOfMonth, startOfMonth, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Button,
  Datepicker,
  type DatepickerPresetRange,
  type DateRange,
  Popover,
} from "prime-ui-kit";
import * as React from "react";

function stayPresets(): DatepickerPresetRange[] {
  const today = new Date();
  const threeNightsTo = addDays(today, 3);
  return [
    { label: "Сегодня", range: { from: today, to: today } },
    { label: "3 ночи", range: { from: today, to: threeNightsTo } },
    { label: "Неделя", range: { from: today, to: addDays(today, 7) } },
    {
      label: "Этот месяц",
      range: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      label: "Прошлая неделя",
      range: { from: subDays(today, 7), to: subDays(today, 1) },
    },
  ];
}

/**
 * Бронирование: диапазон дат, быстрые пресеты и время заезда/выезда.
 */
export function BookingDateRangeExample() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Заезд и выезд
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetPadding="none" side="bottom">
        <Datepicker.Shell
          presets={<Datepicker.Presets mode="range" presets={stayPresets()} onSelect={setRange} />}
        >
          <Datepicker.Calendar
            locale={ru}
            mode="range"
            responsiveMonths
            selected={range}
            onSelect={setRange}
          />
          <Datepicker.Time
            mode="range"
            from={range?.from}
            labels={{ from: "Заезд", to: "Выезд" }}
            to={range?.to}
            onFromChange={(next) => {
              setRange((prev) => ({ from: next, to: prev?.to }));
            }}
            onToChange={(next) => {
              setRange((prev) => ({ from: prev?.from, to: next }));
            }}
          />
        </Datepicker.Shell>
      </Popover.Content>
    </Popover.Root>
  );
}
