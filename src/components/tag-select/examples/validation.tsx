/** Live validation: removing the last region shakes the field and drops the error in, adding one clears it; required and optional markers and a hint — `required`, `optional`, `hint`, `error`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

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
  const [regions, setRegions] = React.useState(["msk"]);

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
        error={regions.length ? undefined : "Добавьте хотя бы один регион"}
        options={CITIES}
        value={regions}
        onValueChange={setRegions}
        placeholder="Добавить регион"
      />
      <TagSelect label="Наблюдатели" optional options={PEOPLE} placeholder="Добавить человека" />
    </>
  );
}
