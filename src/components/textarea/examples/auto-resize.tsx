/** A field that grows with its text next to a fixed one with a resize handle — `autoResize`, `rows`. */
import { Textarea } from "prime-ui-kit";

export default function TextareaAutoResizeExample() {
  return (
    <>
      <Textarea.Root
        label="Описание товара"
        placeholder="Состав, размеры, уход"
        hint="Высота растёт вместе с текстом, минимум три строки"
      />
      <Textarea.Root
        label="Условия договора"
        autoResize={false}
        rows={5}
        placeholder="Текст условий"
        hint="Фиксированная высота, угол можно потянуть"
      />
    </>
  );
}
