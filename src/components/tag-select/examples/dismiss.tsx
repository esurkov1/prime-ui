/** A tag list that stays open while the person reads the task beside it: Escape or Tab close it — `closeOnOutsideClick`, `closeOnEscape`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const OPTIONS: TagSelectOption[] = [
  { value: "design", label: "Дизайн", color: "purple" },
  { value: "backend", label: "Бэкенд", color: "blue" },
  { value: "frontend", label: "Фронтенд", color: "sky" },
  { value: "urgent", label: "Срочно", color: "red" },
  { value: "blocked", label: "Заблокировано", color: "orange" },
];

export default function TagSelectDismissExample() {
  return (
    <TagSelect
      label="Метки задачи"
      options={OPTIONS}
      defaultValue={["backend"]}
      placeholder="Добавить метку"
      closeOnOutsideClick={false}
      closeOnEscape
    />
  );
}
