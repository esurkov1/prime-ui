import { DigitInput, Hint, Label } from "prime-ui-kit";

/**
 * Подпись и подсказка рядом с группой ячеек — типичный блок ввода кода в форме.
 * Паритет с `playground/snippets/digit-input/composition.tsx`.
 */
export default function DigitInputCompositionExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--prime-sys-spacing-m)",
      }}
    >
      <Label.Root size="m">Код из сообщения</Label.Root>
      <DigitInput.Root length={4} size="m" />
      <Hint.Root size="m" variant="default">
        Вставьте код из буфера: цифры распределятся по ячейкам с текущей позиции.
      </Hint.Root>
    </div>
  );
}
