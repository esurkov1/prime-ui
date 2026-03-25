import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

export default function DatepickerStatesSnippet() {
  const [value, setValue] = React.useState<Date | undefined>(() => new Date(2026, 2, 11));

  return (
    <div className="flex flex-col gap-6">
      <ExampleSurface>
        <Datepicker.Shell>
          <p className="m-0 text-[length:var(--prime-sys-size-control-s-text)] text-[var(--prime-sys-color-content-secondary)]">
            Выходные в сетке недоступны: <code>disabled</code> с сопоставителем дней недели (через
            пропсы календаря react-day-picker).
          </p>
          <Datepicker.Calendar
            disabled={{ dayOfWeek: [0, 6] }}
            locale={ru}
            mode="single"
            month={new Date(2026, 2, 1)}
            selected={value}
            onSelect={setValue}
          />
        </Datepicker.Shell>
      </ExampleSurface>
      <ExampleSurface>
        <Datepicker.Shell>
          <p className="m-0 text-[length:var(--prime-sys-size-control-s-text)] text-[var(--prime-sys-color-content-secondary)]">
            Поле времени неактивно, пока нет выбранной даты: выберите день, затем укажите время.
          </p>
          <Datepicker.Calendar
            locale={ru}
            mode="single"
            month={new Date(2026, 2, 1)}
            selected={value}
            onSelect={setValue}
          />
          <Datepicker.Time labels={{ time: "Время" }} value={value} onChange={setValue} />
        </Datepicker.Shell>
      </ExampleSurface>
    </div>
  );
}
