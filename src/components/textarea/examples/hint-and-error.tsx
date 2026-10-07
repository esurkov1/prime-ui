/** Hint under the field and an error that replaces it; a non-empty `error` implies `invalid`. Use it for validation messages. */
import { Textarea } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TextareaHintAndErrorExample() {
  return (
    <div className={styles.pair}>
      <Textarea.Root
        label="Описание"
        placeholder="Расскажите о товаре"
        hint="Покупатели видят первые две строки."
      />
      <Textarea.Root
        label="Описание"
        defaultValue="Ок"
        hint="Покупатели видят первые две строки."
        error="Добавьте хотя бы 20 символов."
      />
    </div>
  );
}
