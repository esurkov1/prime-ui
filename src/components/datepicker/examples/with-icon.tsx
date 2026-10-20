/** A leading glyph before the value: none by default, the calendar, or another icon in its place — `Datepicker.TriggerIcon`. */
import { Datepicker, Icon } from "prime-ui-kit";

const INVOICE_DATE = new Date(2026, 9, 7);
const SHIPPING_DATE = new Date(2026, 9, 12);
const DELIVERY_DATE = new Date(2026, 9, 16);

export default function DatepickerWithIconExample() {
  return (
    <div>
      <Datepicker.Root mode="single" label="Дата счёта" defaultValue={INVOICE_DATE} />
      <Datepicker.Root mode="single" label="Дата отгрузки" defaultValue={SHIPPING_DATE}>
        <Datepicker.TriggerIcon />
      </Datepicker.Root>
      <Datepicker.Root mode="single" label="Дата доставки" defaultValue={DELIVERY_DATE}>
        <Datepicker.TriggerIcon>
          <Icon name="object.truck" />
        </Datepicker.TriggerIcon>
      </Datepicker.Root>
    </div>
  );
}
