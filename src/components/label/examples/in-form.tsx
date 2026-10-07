/** Built-in Input labels next to a standalone `Label.Root` over a Select look the same; the Select is linked via `aria-labelledby`. Use a standalone Label for controls without a `label` prop. */
import { Input, Label, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function LabelInFormExample() {
  const roleLabelId = React.useId();

  return (
    <form className={styles.form} aria-label="Приглашение в команду">
      <Input.Root label="Email" required>
        <Input.Wrapper>
          <Input.Field type="email" placeholder="name@company.ru" />
        </Input.Wrapper>
      </Input.Root>
      <div className={styles.field}>
        <Label.Root id={roleLabelId} required>
          Роль
        </Label.Root>
        <Select.Root placeholder="Выберите роль" defaultValue="editor">
          <Select.Trigger aria-labelledby={roleLabelId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="admin">Администратор</Select.Item>
            <Select.Item value="editor">Редактор</Select.Item>
            <Select.Item value="viewer">Наблюдатель</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Input.Root label="Должность" optional hint="Видна коллегам в профиле.">
        <Input.Wrapper>
          <Input.Field placeholder="Например, аналитик" />
        </Input.Wrapper>
      </Input.Root>
    </form>
  );
}
