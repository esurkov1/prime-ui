/** Every size tier with two picked tags; chips sit one tier below the field — `size`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

const OPTIONS: TagSelectOption[] = [
  { value: "design", label: "Дизайн", color: "purple" },
  { value: "backend", label: "Бэкенд", color: "blue" },
  { value: "urgent", label: "Срочно", color: "red" },
];

export default function TagSelectSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <TagSelect
          key={size}
          size={size}
          label={size}
          options={OPTIONS}
          defaultValue={["design", "backend"]}
          labels={{ panelHint: "Выберите метку" }}
        />
      ))}
    </>
  );
}
