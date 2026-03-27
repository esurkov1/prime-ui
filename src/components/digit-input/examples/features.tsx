import { DigitInput } from "prime-ui-kit";
import * as React from "react";

/**
 * Разная длина ряда, начальное значение, колбэк по завершении ввода.
 * Паритет с `playground/snippets/digit-input/features.tsx`.
 */
export default function DigitInputFeaturesExample() {
  const [completed, setCompleted] = React.useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "flex-start",
      }}
    >
      <p style={{ margin: 0 }}>Пропы length и defaultValue без внешнего состояния</p>
      <DigitInput.Root length={4} defaultValue="2184" />
      <DigitInput.Root length={6} defaultValue="12" />
      <p style={{ margin: 0 }}>onComplete — один раз при заполнении последней ячейки</p>
      <DigitInput.Root length={4} onComplete={(v) => setCompleted(v)} />
      <p style={{ margin: 0 }}>
        {completed ? `Последний полный код: ${completed}` : "Введите четыре цифры подряд"}
      </p>
    </div>
  );
}
