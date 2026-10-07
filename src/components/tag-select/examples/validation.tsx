/** Required and optional markers, a hint, and an error that replaces the hint in the same row — `required`, `optional`, `hint`, `error`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const CITIES: TagSelectOption[] = [
  { value: "msk", label: "Москва", color: "blue" },
  { value: "spb", label: "Санкт-Петербург", color: "teal" },
  { value: "kzn", label: "Казань", color: "green" },
];

const PEOPLE: TagSelectOption[] = [
  { value: "anna", label: "Анна Смирнова" },
  { value: "igor", label: "Игорь Петров" },
];

export default function TagSelectValidationExample() {
  return (
    <>
      <TagSelect
        label="Города доставки"
        required
        hint="Склады, откуда отправляем заказы"
        options={CITIES}
        defaultValue={["msk"]}
      />
      <TagSelect
        label="Регионы"
        required
        error="Добавьте хотя бы один регион"
        options={CITIES}
        placeholder="Добавить регион"
      />
      <TagSelect label="Наблюдатели" optional options={PEOPLE} placeholder="Добавить человека" />
    </>
  );
}
