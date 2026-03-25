import * as React from "react";

import { DigitInput } from "@/components/digit-input/DigitInput";

/** Разная длина ряда, начальное значение, колбэк по завершении ввода. */
export default function DigitInputFeaturesSnippet() {
  const [completed, setCompleted] = React.useState<string | null>(null);

  return (
    <>
      <p className="previewCaption">Пропы length и defaultValue без внешнего состояния</p>
      <DigitInput.Root length={4} defaultValue="2184" />
      <div className="previewBlockSpacer" />
      <DigitInput.Root length={6} defaultValue="12" />
      <div className="previewBlockSpacer" />
      <p className="previewCaption">onComplete — один раз при заполнении последней ячейки</p>
      <DigitInput.Root length={4} onComplete={(v) => setCompleted(v)} />
      <p className="previewCaption previewCaptionTopTight">
        {completed ? `Последний полный код: ${completed}` : "Введите четыре цифры подряд"}
      </p>
    </>
  );
}
