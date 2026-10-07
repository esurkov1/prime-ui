/** A task form in a card with a creatable labels field and an optional watchers field next to an Input. Use it for tag fields inside forms. */
import { Button, Card, Input, TagSelect, type TagSelectOption } from "prime-ui-kit";

import styles from "./examples.module.css";

const labels: TagSelectOption[] = [
  { value: "bug", label: "Ошибка", color: "red" },
  { value: "feature", label: "Новая функция", color: "blue" },
  { value: "ux", label: "UX", color: "purple" },
  { value: "docs", label: "Документация", color: "gray" },
];

const people: TagSelectOption[] = [
  { value: "anna", label: "Анна Смирнова" },
  { value: "igor", label: "Игорь Петров" },
  { value: "olga", label: "Ольга Ким" },
];

export default function TagSelectInFormExample() {
  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Новая задача</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <Input.Root label="Название" required>
            <Input.Wrapper>
              <Input.Field placeholder="Коротко о задаче" />
            </Input.Wrapper>
          </Input.Root>
          <TagSelect.Root
            label="Метки"
            options={labels}
            defaultValue={["bug"]}
            creatable
            labels={{ panelHint: "Выберите метку или создайте новую" }}
            placeholder="Добавить метку"
          />
          <TagSelect.Root
            label="Наблюдатели"
            optional
            hint="Получат уведомления об изменениях"
            options={people}
            labels={{ panelHint: "" }}
            placeholder="Добавить человека"
          />
          <div className={styles.actions}>
            <Button.Root variant="ghost" tone="neutral">
              Отмена
            </Button.Root>
            <Button.Root type="submit">Создать задачу</Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
