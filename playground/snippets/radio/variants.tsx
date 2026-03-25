import { Radio } from "@/components/radio/Radio";

export default function RadioVariantsSnippet() {
  return (
    <>
      <Radio.Root name="radio-var-ok" value="ok" defaultChecked size="m">
        <Radio.Label>Обычное состояние</Radio.Label>
        <Radio.Hint>Подсказка для валидного варианта (variant по умолчанию).</Radio.Hint>
      </Radio.Root>
      <Radio.Root name="radio-var-err" value="bad" variant="error" size="m">
        <Radio.Label>Вариант с ошибкой</Radio.Label>
        <Radio.Error>Выберите корректный вариант доставки.</Radio.Error>
      </Radio.Root>
    </>
  );
}
