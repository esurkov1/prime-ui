/** Empty, overflowing into «+N», error and disabled fields, with a disabled option in the list. Use it as a reference for every field state. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

import styles from "./examples.module.css";

const options: TagSelectOption[] = [
  { value: "msk", label: "Москва", color: "blue" },
  { value: "spb", label: "Санкт-Петербург", color: "teal" },
  { value: "kzn", label: "Казань", color: "green" },
  { value: "ekb", label: "Екатеринбург", color: "orange" },
  { value: "nsk", label: "Новосибирск", color: "purple" },
  { value: "sam", label: "Самара", color: "pink" },
  { value: "ufa", label: "Уфа", color: "sky" },
  { value: "krs", label: "Красноярск", color: "yellow" },
  { value: "vvo", label: "Владивосток", color: "red" },
  { value: "kgd", label: "Калининград", disabled: true },
];

const LABELS = { panelHint: "Выберите город" };

export default function TagSelectStatesExample() {
  return (
    <div className={styles.grid}>
      <TagSelect.Root
        label="Пусто"
        hint="Длинный список прокручивается, «Калининград» недоступен"
        options={options}
        labels={LABELS}
        placeholder="Добавить город"
      />
      <TagSelect.Root
        label="Переполнение"
        hint="В покое — одна строка и «+N»; в фокусе видны все"
        options={options}
        labels={LABELS}
        defaultValue={["msk", "spb", "kzn", "ekb", "nsk"]}
      />
      <TagSelect.Root
        label="Ошибка"
        required
        error="Добавьте хотя бы один город"
        options={options}
        labels={LABELS}
        placeholder="Добавить город"
      />
      <TagSelect.Root label="Отключено" options={options} defaultValue={["msk", "kzn"]} disabled />
    </div>
  );
}
