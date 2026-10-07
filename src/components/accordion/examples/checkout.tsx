/** Checkout steps in `layout="separate"` with `collapsible={false}` and form fields inside the panels. Use for step-by-step forms where one step is always open. */
import { Accordion, Button, Input, Radio } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function AccordionCheckoutExample() {
  return (
    <div className={styles.stack}>
      <Accordion.Root layout="separate" defaultValue="address" collapsible={false}>
        <Accordion.Item value="address">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>1. Адрес доставки</span>
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div className={styles.form}>
              <Input.Root label="Город" required>
                <Input.Wrapper>
                  <Input.Field defaultValue="Москва" />
                </Input.Wrapper>
              </Input.Root>
              <div className={styles.row}>
                <Input.Root label="Улица и дом" required>
                  <Input.Wrapper>
                    <Input.Field placeholder="Тверская, 7" />
                  </Input.Wrapper>
                </Input.Root>
                <Input.Root label="Квартира" optional>
                  <Input.Wrapper>
                    <Input.Field />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="payment">
          <Accordion.Header>
            <Accordion.Trigger>
              <span>2. Оплата</span>
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div className={styles.form}>
              <Radio.Group
                name="checkout-payment"
                defaultValue="card"
                aria-label="Способ оплаты"
                className={styles.choices}
              >
                <Radio.Root value="card">
                  <Radio.Label>Картой онлайн</Radio.Label>
                </Radio.Root>
                <Radio.Root value="sbp">
                  <Radio.Label>СБП</Radio.Label>
                </Radio.Root>
                <Radio.Root value="cash">
                  <Radio.Label>При получении</Radio.Label>
                  <Radio.Hint>Только в пунктах выдачи</Radio.Hint>
                </Radio.Root>
              </Radio.Group>
              <div>
                <Button.Root>Перейти к подтверждению</Button.Root>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
