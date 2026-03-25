import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaStatesSnippet() {
  return (
    <>
      <Textarea.Root size="m" placeholder="С подсказкой">
        <Textarea.Hint>Обычное состояние</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" placeholder="Недоступно для ввода" disabled>
        <Textarea.Hint>disabled</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" defaultValue="Только чтение" readOnly>
        <Textarea.Hint>readOnly</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" required placeholder="Обязательное поле" />
    </>
  );
}
