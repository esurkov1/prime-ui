import { Radio } from "@/components/radio/Radio";

export default function RadioCompositionSnippet() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Radio.Root name="radio-comp-pay" value="card" defaultChecked size="m">
        <Radio.Label>Банковская карта</Radio.Label>
        <Radio.Hint>Списание сразу после подтверждения заказа.</Radio.Hint>
      </Radio.Root>
      <Radio.Root name="radio-comp-pay" value="invoice" size="m">
        <Radio.Label>Счёт для юрлица</Radio.Label>
        <Radio.Hint>Реквизиты придут на почту в течение рабочего дня.</Radio.Hint>
      </Radio.Root>
    </div>
  );
}
