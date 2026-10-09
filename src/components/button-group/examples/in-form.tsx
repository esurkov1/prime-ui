/** A task form: the priority toggles are a labelled field checked on submit, and native submit and reset segments sit in one group — `label`, `required`, `error`, `type`. */
import { ButtonGroup, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PRIORITIES = [
  { value: "low", label: "Низкий" },
  { value: "normal", label: "Обычный" },
  { value: "high", label: "Высокий" },
];

export default function ButtonGroupInFormExample() {
  const [priority, setPriority] = React.useState("");
  const [error, setError] = React.useState<string>();

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setError(priority ? undefined : "Выберите приоритет задачи");
      }}
      onReset={() => {
        setPriority("");
        setError(undefined);
      }}
    >
      <Input.Root label="Задача" required>
        <Input.Wrapper>
          <Input.Field name="title" defaultValue="Подготовить акт сверки для «Северного ветра»" />
        </Input.Wrapper>
      </Input.Root>
      <ButtonGroup.Root label="Приоритет" required error={error}>
        {PRIORITIES.map((option) => (
          <ButtonGroup.Item
            key={option.value}
            pressed={priority === option.value}
            onClick={() => {
              setPriority(option.value);
              setError(undefined);
            }}
          >
            {option.label}
          </ButtonGroup.Item>
        ))}
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Создать задачу или очистить форму">
        <ButtonGroup.Item type="submit">Создать</ButtonGroup.Item>
        <ButtonGroup.Item type="reset">Очистить</ButtonGroup.Item>
      </ButtonGroup.Root>
    </form>
  );
}
