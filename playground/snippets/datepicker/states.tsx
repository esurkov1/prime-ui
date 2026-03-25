import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { Popover } from "@/components/popover/Popover";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerStatesSnippet() {
  const [value, setValue] = React.useState<Date | undefined>(() => new Date(2026, 2, 11));
  const [openDisabled, setOpenDisabled] = React.useState(false);
  const [openTime, setOpenTime] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <ExampleSurface>
        <p className="m-0 text-[length:var(--prime-sys-size-control-s-text)] text-[var(--prime-sys-color-content-secondary)]">
          Выходные в сетке недоступны: <code>disabled</code> с сопоставителем дней недели (через
          пропсы календаря react-day-picker).
        </p>
        <Popover.Root open={openDisabled} onOpenChange={setOpenDisabled}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              Календарь: выходные disabled
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom">
            <Popover.Inset padding="none">
              <Datepicker.Shell>
                <Datepicker.Calendar
                  disabled={{ dayOfWeek: [0, 6] }}
                  locale={ru}
                  mode="single"
                  month={new Date(2026, 2, 1)}
                  selected={value}
                  onSelect={setValue}
                />
              </Datepicker.Shell>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </ExampleSurface>
      <ExampleSurface>
        <p className="m-0 text-[length:var(--prime-sys-size-control-s-text)] text-[var(--prime-sys-color-content-secondary)]">
          Поле времени неактивно, пока нет выбранной даты: выберите день, затем укажите время.
        </p>
        <Popover.Root open={openTime} onOpenChange={setOpenTime}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" size="m" variant="neutral">
              Дата + время (time disabled до даты)
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom">
            <Popover.Inset padding="none">
              <Datepicker.Shell>
                <Datepicker.Calendar
                  locale={ru}
                  mode="single"
                  month={new Date(2026, 2, 1)}
                  selected={value}
                  onSelect={setValue}
                />
                <Datepicker.Time labels={{ time: "Время" }} value={value} onChange={setValue} />
              </Datepicker.Shell>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </ExampleSurface>
    </div>
  );
}
