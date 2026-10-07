/** Every size tier; the label and the hint follow the field tier — `size`. */
import { NativeSelect } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function NativeSelectSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <NativeSelect key={size} size={size} label={size} defaultValue="week">
          <option value="day">За день</option>
          <option value="week">За неделю</option>
          <option value="month">За месяц</option>
        </NativeSelect>
      ))}
    </>
  );
}
