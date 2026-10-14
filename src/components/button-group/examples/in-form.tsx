/** A task form: the priority toggles are a labelled field checked on submit, an optional reminder, and native submit and reset segments in one group — `label`, `required`, `hint`, `error`, `optional`, `type`. */
import { ButtonGroup, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PRIORITIES = [
  { value: "low", label: "Низкий" },
  { value: "normal", label: "Обычный" },
  { value: "high", label: "Высокий" },
];

const REMINDERS = ["За час", "За день"];

export default function ButtonGroupInFormExample() {
  const [priority, setPriority] = React.useState("");
  const [reminder, setReminder] = React.useState("");
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
        setReminder("");
        setError(undefined);
      }}
    >
      <Input.Root label="Задача" required>
        <Input.Wrapper>
          <Input.Field name="title" defaultValue="Подготовить акт сверки для «Северного ветра»" />
        </Input.Wrapper>
      </Input.Root>
      <ButtonGroup.Root
        label="Приоритет"
        required
        hint="Высокий поднимает задачу в начало списка"
        error={error}
      >
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
      <ButtonGroup.Root label="Напомнить" optional>
        {REMINDERS.map((option) => (
          <ButtonGroup.Item
            key={option}
            pressed={reminder === option}
            onClick={() => setReminder(reminder === option ? "" : option)}
          >
            {option}
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
