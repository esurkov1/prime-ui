import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaVariantsSnippet() {
  return (
    <>
      <Textarea.Root variant="default" placeholder="Обычное поле (variant=default)">
        <Textarea.Hint>Подсказка под полем</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root variant="error" placeholder="Поле с ошибкой валидации">
        <Textarea.Error>Заполните описание</Textarea.Error>
      </Textarea.Root>
    </>
  );
}
