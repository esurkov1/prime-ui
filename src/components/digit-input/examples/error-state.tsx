import { DigitInput, Hint, Label } from "prime-ui-kit";

/** Отклонённый код: визуальная ошибка на группе и текст подсказки в тоне danger. */
export default function ErrorStateExample() {
  return (
    <>
      <Label.Root>Код подтверждения</Label.Root>
      <DigitInput.Root defaultValue="1230" hasError length={4} />
      <Hint.Root variant="error">Неверный код. Запросите новый или проверьте ввод.</Hint.Root>
    </>
  );
}
