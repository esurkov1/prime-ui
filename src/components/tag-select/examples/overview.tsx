/** A labelled tag field: focus opens the list, typing filters it, picked tags become chips — `label`, `options`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const OPTIONS: TagSelectOption[] = [
  { value: "design", label: "Дизайн", color: "purple" },
  { value: "backend", label: "Бэкенд", color: "blue" },
  { value: "frontend", label: "Фронтенд", color: "sky" },
  { value: "urgent", label: "Срочно", color: "red" },
];

export default function TagSelectOverviewExample() {
  return (
    <TagSelect
      label="Метки задачи"
      options={OPTIONS}
      defaultValue={["design"]}
      placeholder="Добавить метку"
      labels={{ panelHint: "Выберите метку" }}
    />
  );
}
