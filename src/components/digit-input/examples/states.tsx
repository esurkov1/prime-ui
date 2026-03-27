import { DigitInput } from "prime-ui-kit";

/**
 * Обычное поле, визуальная ошибка (`hasError`) и отключённый ввод (`disabled`).
 * Паритет с `playground/snippets/digit-input/states.tsx`.
 */
export default function DigitInputStatesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "center",
      }}
    >
      <DigitInput.Root length={4} defaultValue="42" />
      <DigitInput.Root length={4} defaultValue="12" hasError />
      <DigitInput.Root length={4} defaultValue="99" disabled />
    </div>
  );
}
