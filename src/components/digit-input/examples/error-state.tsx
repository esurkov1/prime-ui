import { DigitInput, Hint, Label } from "prime-ui-kit";

/** Отклонённый код: визуальная ошибка на группе и текст подсказки в тоне danger. */
export default function ErrorStateExample() {
  return (
    <>
      <Label.Root size="m">Код подтверждения</Label.Root>
      <DigitInput.Root defaultValue="1230" hasError length={4} size="m" />
      <Hint.Root size="m" variant="error">
        Неверный код. Запросите новый или проверьте ввод.
      </Hint.Root>
    </>
  );
}
