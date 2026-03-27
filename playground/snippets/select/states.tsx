import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectStatesSnippet() {
  return (
    <div className={`stack ${styles.stackNarrow}`}>
      <Select.Root placeholder="Только подсказка">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Вариант A</Select.Item>
          <Select.Item value="b">Вариант B</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root defaultValue="b" placeholder="С начальным значением">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Вариант A</Select.Item>
          <Select.Item value="b">Вариант B</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root defaultValue="on" disabled placeholder="Отключён">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="off">Выкл</Select.Item>
          <Select.Item value="on">Вкл</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root hasError placeholder="Ошибка валидации">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="1">Пункт 1</Select.Item>
          <Select.Item value="2">Пункт 2</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
