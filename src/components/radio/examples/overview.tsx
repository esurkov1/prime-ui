/** A labelled group of options with one chosen by default — `label`, `defaultValue`. */
import { Radio } from "prime-ui-kit";

export default function RadioOverviewExample() {
  return (
    <Radio.Group label="Доставка" name="delivery" defaultValue="courier">
      <Radio.Root value="courier">
        <Radio.Label>Курьером</Radio.Label>
      </Radio.Root>
      <Radio.Root value="pickup">
        <Radio.Label>Самовывоз из пункта выдачи</Radio.Label>
      </Radio.Root>
      <Radio.Root value="post">
        <Radio.Label>Почтой России</Radio.Label>
      </Radio.Root>
    </Radio.Group>
  );
}
