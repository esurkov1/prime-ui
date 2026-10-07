/** Empty, filled, error, read-only and disabled fields. Use it to check every state of a multi-line field. */
import { Textarea } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TextareaStatesExample() {
  return (
    <div className={styles.pair}>
      <Textarea.Root label="Пустое" placeholder="Начните печатать" />
      <Textarea.Root label="Заполненное" defaultValue="Позвоните за час до доставки." />
      <Textarea.Root label="Ошибка" defaultValue="—" error="Опишите причину возврата." />
      <Textarea.Root
        label="Только чтение"
        readOnly
        defaultValue="Заявка закрыта 12 марта."
        hint="Текст можно выделить и скопировать."
      />
      <Textarea.Root
        label="Отключено"
        disabled
        placeholder="Недоступно"
        hint="Поле станет доступно после выбора заказа."
      />
    </div>
  );
}
