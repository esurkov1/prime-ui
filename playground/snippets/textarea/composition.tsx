import { Textarea } from "@/components/textarea/Textarea";
import { Typography } from "@/components/typography/Typography";

import styles from "./snippets.module.css";

export default function TextareaCompositionSnippet() {
  return (
    <div className={styles.compositionStack}>
      <Typography.Root variant="body-small" weight="medium" as="div">
        Комментарий к заказу
      </Typography.Root>
      <Textarea.Root placeholder="Уточните адрес или время доставки">
        <Textarea.CharCounter current={0} max={240} />
        <Textarea.Hint>Текст увидит служба логистики до отгрузки.</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root variant="error" placeholder="Опишите причину возврата">
        <Textarea.Error>Без описания заявку не отправить</Textarea.Error>
      </Textarea.Root>
    </div>
  );
}
