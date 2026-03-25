import { Label } from "@/components/label/Label";

/** Обычная подпись к полю, неактивный лейбл и маркер обязательности через `Label.Asterisk`. */
export default function LabelStatesSnippet() {
  return (
    <>
      <Label.Root htmlFor="demo-label-st-1">Название профиля</Label.Root>
      <Label.Root htmlFor="demo-label-st-2" disabled>
        Поле только для чтения
      </Label.Root>
      <Label.Root htmlFor="demo-label-st-3">
        Телефон
        <Label.Asterisk />
      </Label.Root>
    </>
  );
}
