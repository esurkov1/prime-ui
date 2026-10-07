/** More tags than fit: at rest one row with «+N», focused every tag on up to three wrapped rows that scroll — `defaultValue`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const CITIES: TagSelectOption[] = [
  { value: "msk", label: "Москва", color: "blue" },
  { value: "spb", label: "Санкт-Петербург", color: "teal" },
  { value: "kzn", label: "Казань", color: "green" },
  { value: "ekb", label: "Екатеринбург", color: "orange" },
  { value: "nsk", label: "Новосибирск", color: "purple" },
  { value: "sam", label: "Самара", color: "pink" },
  { value: "ufa", label: "Уфа", color: "sky" },
  { value: "krs", label: "Красноярск", color: "yellow" },
  { value: "vvo", label: "Владивосток", color: "red" },
];

const PICKED = ["msk", "spb", "kzn", "ekb", "nsk", "sam", "ufa"];

export default function TagSelectManyTagsExample() {
  return <TagSelect label="Города доставки" options={CITIES} defaultValue={PICKED} />;
}
