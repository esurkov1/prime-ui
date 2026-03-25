import * as React from "react";

import { DigitInput } from "@/components/digit-input/DigitInput";

/** Значение держит родитель: `value` и `onChange`; подпись показывает прогресс заполнения. */
export default function DigitInputControlledSnippet() {
  const [code, setCode] = React.useState("");

  return (
    <>
      <DigitInput.Root length={4} value={code} onChange={setCode} />
      <p className="previewCaption previewCaptionTopTight">
        Собранная строка: {code.length > 0 ? code : "пусто"} ({code.length}/4)
      </p>
    </>
  );
}
