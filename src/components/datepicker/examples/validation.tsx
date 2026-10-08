/** A leave period checked live: the error shakes in, names the broken rule and leaves once the period fits; an optional return date — `required`, `hint`, `error`, `optional`. */
import { Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

const MAX_DAYS = 28;
const DAY_MS = 24 * 60 * 60 * 1000;
const LONG_PERIOD: DatepickerRange = { from: new Date(2026, 6, 1), to: new Date(2026, 7, 4) };

/** The period error, or nothing when both ends are set and the period fits the limit. */
function periodError({ from, to }: DatepickerRange) {
  if (!from || !to) return "Укажите начало и конец отпуска";
  if ((to.getTime() - from.getTime()) / DAY_MS + 1 > MAX_DAYS)
    return "Больше 28 дней подряд нельзя";
  return undefined;
}

export default function DatepickerValidationExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>(LONG_PERIOD);

  return (
    <>
      <Datepicker.Root
        mode="range"
        label="Период отпуска"
        required
        hint="Не больше 28 дней подряд"
        placeholder="Выбрать период"
        value={period}
        onValueChange={setPeriod}
        error={periodError(period)}
        fullWidth
      />
      <Datepicker.Root mode="single" label="Выход на работу" optional fullWidth />
    </>
  );
}
