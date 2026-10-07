/** Every size tier: the field is 28 to 48 px high, the day cell of the panel 24 to 40 px — `size`. */
import { Datepicker } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const INVOICE_DATE = new Date(2026, 9, 7);

export default function DatepickerSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Datepicker.Root
          key={size}
          size={size}
          mode="single"
          label={size}
          defaultValue={INVOICE_DATE}
          fullWidth
        />
      ))}
    </>
  );
}
