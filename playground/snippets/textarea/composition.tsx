import { Textarea } from "@/components/textarea/Textarea";
import { Typography } from "@/components/typography/Typography";

export default function TextareaCompositionSnippet() {
  return (
    <div style={{ display: "grid", gap: "12px", maxWidth: "min(100%, 28rem)" }}>
      <Typography.Root size="s" weight="medium" as="div">
        Комментарий к заказу
      </Typography.Root>
      <Textarea.Root size="m" placeholder="Уточните адрес или время доставки">
        <Textarea.CharCounter current={0} max={240} />
        <Textarea.Hint>Текст увидит служба логистики до отгрузки.</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" variant="error" placeholder="Опишите причину возврата">
        <Textarea.Error>Без описания заявку не отправить</Textarea.Error>
      </Textarea.Root>
    </div>
  );
}
