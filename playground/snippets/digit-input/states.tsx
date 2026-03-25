import { DigitInput } from "@/components/digit-input/DigitInput";

/** Обычное поле, визуальная ошибка (hasError) и отключённый ввод (disabled). */
export default function DigitInputStatesSnippet() {
  return (
    <>
      <DigitInput.Root length={4} defaultValue="42" />
      <div className="previewBlockSpacer" />
      <DigitInput.Root length={4} defaultValue="12" hasError />
      <div className="previewBlockSpacer" />
      <DigitInput.Root length={4} defaultValue="99" disabled />
    </>
  );
}
