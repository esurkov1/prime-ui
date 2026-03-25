import type { CSSProperties } from "react";
import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";

const rowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--prime-sys-spacing-xs)",
  alignItems: "flex-start",
  maxWidth: "20rem",
};

/** Подсказки под полями в типичных состояниях экрана: обычное, ошибка, отключённое поле. */
export default function HintFieldStatesSnippet() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={rowStyle}>
        <Label.Root htmlFor="hint-demo-ok" size="m">
          Название проекта
        </Label.Root>
        <input id="hint-demo-ok" type="text" defaultValue="Альфа" />
        <Hint.Root size="m" variant="default">
          Виден всем участникам рабочей области.
        </Hint.Root>
      </div>
      <div style={rowStyle}>
        <Label.Root htmlFor="hint-demo-err" size="m">
          Код ИНН
        </Label.Root>
        <input id="hint-demo-err" type="text" defaultValue="12" aria-invalid="true" />
        <Hint.Root size="m" variant="error">
          Введите 10 или 12 цифр.
        </Hint.Root>
      </div>
      <div style={rowStyle}>
        <Label.Root htmlFor="hint-demo-dis" size="m" disabled>
          Лимит запросов
        </Label.Root>
        <input id="hint-demo-dis" type="text" disabled value="только чтение" />
        <Hint.Root size="m" variant="disabled">
          Значение приходит из тарифа и не редактируется.
        </Hint.Root>
      </div>
    </div>
  );
}
