import { DigitInput } from "prime-ui-kit";
import * as React from "react";

/**
 * Значение держит родитель: `value` и `onChange`; подпись показывает прогресс заполнения.
 * Паритет с `playground/snippets/digit-input/controlled.tsx`.
 */
export default function DigitInputControlledExample() {
  const [code, setCode] = React.useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-s)",
        alignItems: "flex-start",
      }}
    >
      <DigitInput.Root length={4} value={code} onChange={setCode} />
      <p style={{ margin: 0 }}>
        Собранная строка: {code.length > 0 ? code : "пусто"} ({code.length}/4)
      </p>
    </div>
  );
}
