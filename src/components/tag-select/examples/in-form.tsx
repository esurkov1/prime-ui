/** A new task form: the required labels field is checked on submit, its error shakes the field and leaves once a label is added, a calm note confirms the task — `required`, `error`, `creatable`. */
import { Button, Input, TagSelect, type TagSelectOption, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LABELS: TagSelectOption[] = [
  { value: "bug", label: "Ошибка", color: "red" },
  { value: "feature", label: "Новая функция", color: "blue" },
  { value: "ux", label: "UX", color: "purple" },
];

const PEOPLE: TagSelectOption[] = [
  { value: "anna", label: "Анна Смирнова" },
  { value: "igor", label: "Игорь Петров" },
  { value: "olga", label: "Ольга Ким" },
];

export default function TagSelectInFormExample() {
  const [labels, setLabels] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>();
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(labels.length ? undefined : "Добавьте хотя бы одну метку");
    setSaved(labels.length > 0);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Typography as="h3" variant="title-m">
        Новая задача
      </Typography>
      <Input.Root label="Название" required>
        <Input.Wrapper>
          <Input.Field name="title" placeholder="Коротко о задаче" />
        </Input.Wrapper>
      </Input.Root>
      <TagSelect
        label="Метки"
        required
        hint="Помогают фильтровать задачи"
        error={error}
        options={LABELS}
        value={labels}
        onValueChange={(next) => {
          setLabels(next);
          setError(undefined);
          setSaved(false);
        }}
        creatable
        placeholder="Добавить метку"
      />
      <TagSelect label="Наблюдатели" optional options={PEOPLE} placeholder="Добавить человека" />
      <div className={styles.actions}>
        {saved ? (
          <Typography as="p" variant="body-s" tone="secondary">
            Задача создана
          </Typography>
        ) : null}
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setLabels([]);
            setError(undefined);
            setSaved(false);
          }}
        >
          Отмена
        </Button.Root>
        <Button.Root type="submit">Создать задачу</Button.Root>
      </div>
    </form>
  );
}
