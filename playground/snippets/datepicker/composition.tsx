import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Datepicker, type DatepickerPresetSingle } from "@/components/datepicker/Datepicker";
import ExampleSurface from "../../components/ExampleSurface";

function buildPresets(): DatepickerPresetSingle[] {
  const today = new Date();
  return [
    { label: "Сегодня", date: today },
    { label: "+3 дня", date: addDays(today, 3) },
    { label: "Сброс", date: undefined },
  ];
}

export default function DatepickerCompositionSnippet() {
  const [value, setValue] = React.useState<Date | undefined>();

  return (
    <ExampleSurface>
      <Datepicker.Shell
        presets={<Datepicker.Presets mode="single" presets={buildPresets()} onSelect={setValue} />}
        size="m"
      >
        <Datepicker.Calendar
          locale={ru}
          mode="single"
          responsiveMonths
          selected={value}
          onSelect={setValue}
        />
        <Datepicker.Time labels={{ time: "Время слота" }} value={value} onChange={setValue} />
        <Datepicker.Value as="p" tone="muted">
          {value
            ? `Выбрано: ${format(value, "dd.MM.yyyy HH:mm", { locale: ru })}`
            : "Пресет, календарь и время делят одно состояние в родителе."}
        </Datepicker.Value>
      </Datepicker.Shell>
    </ExampleSurface>
  );
}
