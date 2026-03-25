import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaFullWidthSnippet() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "20rem",
        border: "1px dashed var(--prime-sys-color-border-subtle)",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <Textarea.Root size="m" placeholder="Поле на всю ширину контейнера карточки">
        <Textarea.Hint>Родитель задаёт ширину; у корня поля width: 100%.</Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
