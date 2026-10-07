/** An annual price change date: day and month without a year, a value prefix and taken days disabled — `yearless`, `valuePrefix`, `isDayDisabled`. */
import { Datepicker, YEARLESS_YEAR } from "prime-ui-kit";

const TAKEN_DAYS = [
  new Date(YEARLESS_YEAR, 9, 1).getTime(),
  new Date(YEARLESS_YEAR, 9, 31).getTime(),
];

export default function DatepickerYearlessExample() {
  return (
    <Datepicker.Root
      mode="single"
      label="Ежегодное изменение цены"
      yearless
      defaultValue={new Date(YEARLESS_YEAR, 9, 15)}
      valuePrefix="С"
      isDayDisabled={(day) => TAKEN_DAYS.includes(day.getTime())}
    />
  );
}
