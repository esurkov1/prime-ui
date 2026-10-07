/** Label row: `required` asterisk, `optional` marker with a custom `labels.optional`, and `aria-label` when there is no visible label. Use it to mark fields consistently. */
import { Textarea } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TextareaWithLabelExample() {
  return (
    <div className={styles.column}>
      <Textarea.Root label="Описание задачи" required placeholder="Что нужно сделать" />
      <Textarea.Root label="Комментарий" optional placeholder="Пожелания к исполнителю" />
      <Textarea.Root
        label="Заметка"
        optional
        labels={{ optional: "видно только вам" }}
        placeholder="Личная заметка к задаче"
      />
      <Textarea.Root
        aria-label="Ответ в треде"
        placeholder="Без видимой подписи — нужен aria-label"
      />
    </div>
  );
}
