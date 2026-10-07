/** A required group with option descriptions and the group's error under the options — `label`, `required`, `hint`, `error`. */
import { Radio } from "prime-ui-kit";

export default function RadioGroupExample() {
  return (
    <Radio.Group
      label="Способ оплаты"
      name="payment"
      required
      error="Выберите способ оплаты, чтобы оформить заказ"
    >
      <Radio.Root value="card" hint="Списание сразу после подтверждения заказа">
        <Radio.Label>Банковская карта</Radio.Label>
      </Radio.Root>
      <Radio.Root value="invoice" hint="Реквизиты придут на почту в течение рабочего дня">
        <Radio.Label>Счёт для юрлица</Radio.Label>
      </Radio.Root>
      <Radio.Root value="sbp" disabled hint="Подключается в настройках магазина">
        <Radio.Label>СБП</Radio.Label>
      </Radio.Root>
    </Radio.Group>
  );
}
