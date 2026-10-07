/** Every size tier; the label, the list rows and the hint take the tier of the field — `size`. */
import { Select } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SelectSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Select.Root key={size} size={size} label={size} defaultValue="week">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="day">За день</Select.Item>
            <Select.Item value="week">За неделю</Select.Item>
            <Select.Item value="month">За месяц</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
    </>
  );
}
