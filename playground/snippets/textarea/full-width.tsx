import { Textarea } from "@/components/textarea/Textarea";

import styles from "./snippets.module.css";

export default function TextareaFullWidthSnippet() {
  return (
    <div className={styles.fullWidthCard}>
      <Textarea.Root size="m" placeholder="Поле на всю ширину контейнера карточки">
        <Textarea.Hint>Родитель задаёт ширину; у корня поля width: 100%.</Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
