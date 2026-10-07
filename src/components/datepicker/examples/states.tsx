/** An empty field with the default placeholder, a filled one and a disabled one — `disabled`. */
import { Datepicker } from "prime-ui-kit";

const CONTRACT_DATE = new Date(2026, 8, 15);

export default function DatepickerStatesExample() {
  return (
    <>
      <Datepicker.Root mode="single" label="empty" fullWidth />
      <Datepicker.Root mode="single" label="default" defaultValue={CONTRACT_DATE} fullWidth />
      <Datepicker.Root
        mode="single"
        label="disabled"
        defaultValue={CONTRACT_DATE}
        disabled
        fullWidth
      />
    </>
  );
}
