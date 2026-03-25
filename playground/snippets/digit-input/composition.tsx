import { DigitInput } from "@/components/digit-input/DigitInput";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";

/** Подпись и подсказка рядом с группой ячеек — типичный блок ввода кода в форме. */
export default function DigitInputCompositionSnippet() {
  return (
    <div className="previewLabeledCenter">
      <Label.Root size="m">Код из сообщения</Label.Root>
      <DigitInput.Root length={4} size="m" />
      <Hint.Root size="m" variant="default">
        Вставьте код из буфера: цифры распределятся по ячейкам с текущей позиции.
      </Hint.Root>
    </div>
  );
}
