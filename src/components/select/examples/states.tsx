/** Empty with placeholder, selected, clearable, loading, error, disabled and an empty list. Use it as a reference for every field state. */
import { Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ROLES = (
  <>
    <Select.Item value="viewer">Наблюдатель</Select.Item>
    <Select.Item value="editor">Редактор</Select.Item>
    <Select.Item value="admin">Администратор</Select.Item>
  </>
);

export default function SelectStatesExample() {
  const [role, setRole] = React.useState("editor");

  return (
    <div className={styles.grid}>
      <Select.Root label="Пусто" hint="Плейсхолдер вместо значения" placeholder="Выберите роль">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{ROLES}</Select.Content>
      </Select.Root>
      <Select.Root label="Выбрано" defaultValue="admin">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{ROLES}</Select.Content>
      </Select.Root>
      <Select.Root
        label="С кнопкой сброса"
        hint="× или Delete очищают значение"
        value={role}
        onValueChange={setRole}
        placeholder="Выберите роль"
        clearable
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{ROLES}</Select.Content>
      </Select.Root>
      <Select.Root label="Загрузка" placeholder="Загружаем роли…" loading>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{null}</Select.Content>
      </Select.Root>
      <Select.Root
        label="Ошибка"
        required
        error="Выберите роль, чтобы продолжить"
        placeholder="Выберите роль"
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{ROLES}</Select.Content>
      </Select.Root>
      <Select.Root label="Отключено" defaultValue="viewer" disabled>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{ROLES}</Select.Content>
      </Select.Root>
      <Select.Root
        label="Пустой список"
        hint="Откройте: панель покажет пустое состояние"
        placeholder="Нет доступных команд"
        labels={{ empty: "Команд пока нет" }}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{null}</Select.Content>
      </Select.Root>
    </div>
  );
}
