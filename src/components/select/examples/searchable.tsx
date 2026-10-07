/** A long list with a search field: options match their label and keywords, groups and the separator hide while searching — `searchable`, `keywords`, `Select.Group`. */
import { Select } from "prime-ui-kit";

const RUSSIA = [
  { value: "msk", label: "Москва", keywords: "moscow" },
  { value: "spb", label: "Санкт-Петербург", keywords: "питер spb" },
  { value: "nsk", label: "Новосибирск", keywords: "" },
  { value: "ekb", label: "Екатеринбург", keywords: "екб" },
  { value: "kzn", label: "Казань", keywords: "" },
  { value: "nnv", label: "Нижний Новгород", keywords: "нн" },
];

export default function SelectSearchableExample() {
  return (
    <Select.Root
      label="Город доставки"
      placeholder="Выберите город"
      labels={{ search: "Найти город" }}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content searchable>
        <Select.Group label="Россия">
          {RUSSIA.map((city) => (
            <Select.Item key={city.value} value={city.value} keywords={city.keywords}>
              {city.label}
            </Select.Item>
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Group label="Казахстан">
          <Select.Item value="ala">Алматы</Select.Item>
          <Select.Item value="ast">Астана</Select.Item>
          <Select.Item value="shy" disabled>
            Шымкент — скоро
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
