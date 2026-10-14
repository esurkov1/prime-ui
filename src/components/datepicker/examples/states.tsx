/** An empty field with the default placeholder, a filled, a disabled and an invalid one, and one whose focus shows without the ring — `disabled`, `invalid`, `focusRing`. */
import { Datepicker } from "prime-ui-kit";

const CONTRACT_DATE = new Date(2026, 8, 15);

export default function DatepickerStatesExample() {
  return (
    <div>
      <Datepicker.Root mode="single" label="empty" fullWidth />
      <Datepicker.Root mode="single" label="default" defaultValue={CONTRACT_DATE} fullWidth />
      <Datepicker.Root
        mode="single"
        label="disabled"
        defaultValue={CONTRACT_DATE}
        disabled
        fullWidth
      />
      <Datepicker.Root mode="single" label="invalid" invalid fullWidth />
      <Datepicker.Root
        mode="single"
        label="focusRing={false}"
        defaultValue={CONTRACT_DATE}
        focusRing={false}
        fullWidth
      />
    </div>
  );
}
