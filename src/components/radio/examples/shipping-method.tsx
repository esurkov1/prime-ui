import { Radio } from "prime-ui-kit";

import styles from "./radio-examples.module.css";

/** Checkout-style carrier choice: same `name`, short hints under each option. */
export default function ShippingMethodExample() {
  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Shipping method</legend>
      <div className={styles.columnTight}>
        <Radio.Root name="shipping-example" value="standard" defaultChecked>
          <Radio.Label>Standard (5–7 business days)</Radio.Label>
          <Radio.Hint>Free on orders over $50.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="shipping-example" value="express">
          <Radio.Label>Express (2 business days)</Radio.Label>
          <Radio.Hint>Flat rate; tracking included.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="shipping-example" value="pickup">
          <Radio.Label>Pick up in store</Radio.Label>
          <Radio.Hint>Ready next day at your selected location.</Radio.Hint>
        </Radio.Root>
      </div>
    </fieldset>
  );
}
