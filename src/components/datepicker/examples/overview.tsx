/** A shipping date field: a click opens one month, a picked day applies at once — `mode`, `label`. */
import { Datepicker } from "prime-ui-kit";

export default function DatepickerOverviewExample() {
  return <Datepicker.Root mode="single" label="Дата отгрузки" />;
}
