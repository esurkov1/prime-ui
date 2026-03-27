import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/button/Button";
import { Datepicker, type DatepickerPresetRange } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

function buildPresets(): DatepickerPresetRange[] {
  const today = new Date();
  return [
    { label: "Сегодня", range: { from: today, to: today } },
    { label: "Последние 7 дней", range: { from: subDays(today, 6), to: today } },
    { label: "Этот месяц", range: { from: startOfMonth(today), to: endOfMonth(today) } },
    {
      label: "Прошлый месяц",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
  ];
}

export default function DatepickerRangePresetsTimeSnippet() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <ExampleSurface>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            Диапазон, пресеты и время
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Datepicker.Shell
            presets={
              <Datepicker.Presets mode="range" presets={buildPresets()} onSelect={setRange} />
            }
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
              labels={{ from: "Начало", to: "Конец" }}
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
    </ExampleSurface>
  );
}
