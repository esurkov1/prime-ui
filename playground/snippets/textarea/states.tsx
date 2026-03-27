import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaStatesSnippet() {
  return (
    <>
      <Textarea.Root placeholder="С подсказкой">
        <Textarea.Hint>Обычное состояние</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root placeholder="Недоступно для ввода" disabled>
        <Textarea.Hint>disabled</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root defaultValue="Только чтение" readOnly>
        <Textarea.Hint>readOnly</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root required placeholder="Обязательное поле" />
    </>
  );
}
