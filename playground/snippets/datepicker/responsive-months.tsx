import { ru } from "date-fns/locale";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerResponsiveMonthsSnippet() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <ExampleSurface className="examplePreviewBleed">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            Адаптивные месяцы (1–2 колонки)
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" insetPadding="none" side="bottom">
          <Datepicker.Shell>
            <Datepicker.Calendar
              locale={ru}
              mode="range"
              responsiveBreakpoints={{ twoColumns: 500 }}
              responsiveMonths
              selected={range}
              onSelect={setRange}
            />
          </Datepicker.Shell>
        </Popover.Content>
      </Popover.Root>
    </ExampleSurface>
  );
}
