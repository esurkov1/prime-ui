/** A default field next to a disabled and an invalid one, with a disabled option in the list — `disabled`, `invalid`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const OPTIONS: TagSelectOption[] = [
  { value: "msk", label: "Москва", color: "blue" },
  { value: "spb", label: "Санкт-Петербург", color: "teal" },
  { value: "kzn", label: "Казань", color: "green" },
  { value: "kgd", label: "Калининград — склад закрыт", disabled: true },
];

export default function TagSelectStatesExample() {
  return (
    <>
      <TagSelect
        label="default"
        options={OPTIONS}
        defaultValue={["msk"]}
        placeholder="Добавить город"
      />
      <TagSelect label="disabled" options={OPTIONS} defaultValue={["msk", "kzn"]} disabled />
      <TagSelect label="invalid" options={OPTIONS} invalid placeholder="Добавить город" />
    </>
  );
}
