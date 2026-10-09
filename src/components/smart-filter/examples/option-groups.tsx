/** Values of different kinds in one field: owner types and people under their own headings — `options`, `group`. */
import { SmartFilter, type SmartFilterField } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS: SmartFilterField[] = [
  {
    key: "owner",
    label: "Ответственный",
    finite: false,
    options: [
      { value: "me", label: "Я", group: "Кто" },
      { value: "my-team", label: "Моя команда", group: "Кто" },
      { value: "nobody", label: "Не назначен", group: "Кто" },
      { value: "u-anna", label: "Анна Ким", group: "Сотрудники" },
      { value: "u-oleg", label: "Олег Петров", group: "Сотрудники" },
      { value: "u-irina", label: "Ирина Соколова", group: "Сотрудники" },
    ],
  },
  {
    key: "status",
    label: "Статус",
    options: [
      { value: "open", label: "Открыта" },
      { value: "waiting", label: "Ждёт ответа" },
      { value: "closed", label: "Закрыта" },
    ],
  },
];

export default function SmartFilterOptionGroupsExample() {
  return (
    <div className={styles.stack}>
      <SmartFilter.Root fields={FIELDS}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
    </div>
  );
}
