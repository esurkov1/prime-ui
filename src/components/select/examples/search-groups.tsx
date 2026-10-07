/** A searchable list with keywords, groups, a separator and a disabled option. Use it for long lists (cities, countries) where typing is faster than scrolling. */
import { Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const RUSSIA = [
  ["msk", "Москва", "moscow"],
  ["spb", "Санкт-Петербург", "питер spb"],
  ["nsk", "Новосибирск", ""],
  ["ekb", "Екатеринбург", "екб"],
  ["kzn", "Казань", ""],
  ["nnv", "Нижний Новгород", "нн"],
  ["chl", "Челябинск", ""],
  ["krs", "Красноярск", ""],
  ["sam", "Самара", ""],
  ["ufa", "Уфа", ""],
] as const;

export default function SelectSearchGroupsExample() {
  const [city, setCity] = React.useState("");

  return (
    <div className={styles.narrow}>
      <Select.Root
        label="Город доставки"
        value={city}
        onValueChange={setCity}
        placeholder="Выберите город"
        clearable
        labels={{ search: "Найти город" }}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Group>
            <Select.GroupLabel>Россия</Select.GroupLabel>
            {RUSSIA.map(([value, label, keywords]) => (
              <Select.Item key={value} value={value} keywords={keywords}>
                {label}
              </Select.Item>
            ))}
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Казахстан</Select.GroupLabel>
            <Select.Item value="ala">Алматы</Select.Item>
            <Select.Item value="ast">Астана</Select.Item>
            <Select.Item value="shy" disabled>
              Шымкент — скоро
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Typography.Root variant="caption" tone="muted" className={styles.caption}>
        Наберите «питер» — сработают <code>keywords</code>; «xyz» — покажет «Ничего не найдено».
      </Typography.Root>
    </div>
  );
}
