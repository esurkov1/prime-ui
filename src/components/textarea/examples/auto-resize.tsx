/** A field that grows with its text, one that starts as a line and stops growing at five, and a fixed one with a resize handle — `autoResize`, `rows`, `maxRows`. */
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
        label="Комментарий к заказу"
        rows={1}
        maxRows={5}
        placeholder="Например, позвонить за час"
        hint="Начинается с одной строки, после пяти строк прокручивается"
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
