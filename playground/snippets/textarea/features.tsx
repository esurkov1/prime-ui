import * as React from "react";

import { Textarea } from "@/components/textarea/Textarea";

const OVERFLOW_DEMO = "Текст длиннее лимита 30 символов — счётчик подсвечивает переполнение.";

export default function TextareaFeaturesSnippet() {
  const maxLen = 120;
  const overflowMax = 30;
  const nativeLimit = 80;
  const [value, setValue] = React.useState("");
  const [overflowValue, setOverflowValue] = React.useState(OVERFLOW_DEMO);
  const [limited, setLimited] = React.useState("");

  return (
    <>
      <Textarea.Root placeholder="Несколько строк — высота растёт (autoResize по умолчанию)">
        <Textarea.Hint>
          Рост по содержимому через `data-value`; минимальная высота соответствует токену без
          двойного учёта padding.
        </Textarea.Hint>
      </Textarea.Root>
      <div className="previewBlockSpacer">
        <Textarea.Root
          autoResize={false}
          placeholder="Фиксированная высота, угол resize у браузера"
        >
          <Textarea.Hint>autoResize=false</Textarea.Hint>
        </Textarea.Root>
      </div>
      <div className="previewBlockSpacer">
        <Textarea.Root
          placeholder="Счётчик символов в подвале поля"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <Textarea.CharCounter current={value.length} max={maxLen} />
        </Textarea.Root>
      </div>
      <div className="previewBlockSpacer">
        <Textarea.Root value={overflowValue} onChange={(e) => setOverflowValue(e.target.value)}>
          <Textarea.CharCounter current={overflowValue.length} max={overflowMax} />
          <Textarea.Hint>При current &gt; max включается data-overflow на счётчике.</Textarea.Hint>
        </Textarea.Root>
      </div>
      <div className="previewBlockSpacer">
        <Textarea.Root
          placeholder={`Не больше ${nativeLimit} символов`}
          value={limited}
          maxLength={nativeLimit}
          onChange={(e) => setLimited(e.target.value)}
        >
          <Textarea.CharCounter current={limited.length} max={nativeLimit} />
          <Textarea.Hint>maxLength на нативном textarea блокирует лишний ввод.</Textarea.Hint>
        </Textarea.Root>
      </div>
    </>
  );
}
