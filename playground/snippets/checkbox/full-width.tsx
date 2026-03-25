import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxFullWidthSnippet() {
  return (
    <div
      style={{
        maxWidth: 280,
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--prime-sys-color-border-subtle)",
        boxSizing: "border-box",
      }}
    >
      <Checkbox.Root size="m">
        <Checkbox.Label>
          Я согласен с условиями использования сервиса и политикой конфиденциальности
        </Checkbox.Label>
        <Checkbox.Hint>
          Корень поля тянется на ширину контейнера; подпись переносится во второй колонке сетки.
        </Checkbox.Hint>
      </Checkbox.Root>
    </div>
  );
}
