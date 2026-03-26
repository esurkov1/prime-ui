import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Button,
  Datepicker,
  type DatepickerPresetRange,
  type DateRange,
  Popover,
} from "prime-ui-kit";
import * as React from "react";

function reportPresets(): DatepickerPresetRange[] {
  const today = new Date();
  const startPrev = startOfMonth(subMonths(today, 1));
  const endPrev = endOfMonth(subMonths(today, 1));
  return [
    { label: "This month", range: { from: startOfMonth(today), to: endOfMonth(today) } },
    { label: "Last month", range: { from: startPrev, to: endPrev } },
    { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
  ];
}

/**
 * Отчётный диапазон: только календарь и пресеты (без времени).
 */
export function ReportRangeExample() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          Report period
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" insetPadding="none" side="bottom">
        <Datepicker.Shell
          presets={
            <Datepicker.Presets mode="range" presets={reportPresets()} onSelect={setRange} />
          }
        >
          <Datepicker.Calendar
            locale={enUS}
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
          />
        </Datepicker.Shell>
      </Popover.Content>
    </Popover.Root>
  );
}
