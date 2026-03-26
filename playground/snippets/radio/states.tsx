import { Radio } from "@/components/radio/Radio";

export default function RadioStatesSnippet() {
  return (
    <div className="stack">
      <Radio.Root name="radio-st-off" value="u" size="m">
        <Radio.Label>Не выбрано</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-st-on" value="c" defaultChecked size="m">
        <Radio.Label>Выбрано</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-st-dis-a" value="d1" disabled size="m">
        <Radio.Label>Отключено, не выбрано</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-st-dis-b" value="d2" disabled defaultChecked size="m">
        <Radio.Label>Отключено, выбрано</Radio.Label>
      </Radio.Root>
      <Radio.Root name="radio-st-hint" value="h" size="m">
        <Radio.Label>С подсказкой</Radio.Label>
        <Radio.Hint>Дополнительный текст связан с полем через aria-describedby.</Radio.Hint>
      </Radio.Root>
    </div>
  );
}
