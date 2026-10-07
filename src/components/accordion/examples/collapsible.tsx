/** Checkout steps where one step always stays open — `collapsible`. */
import { Accordion } from "prime-ui-kit";

import styles from "./examples.module.css";

const STEPS = [
  { value: "address", title: "1. Адрес доставки", text: "Москва, Тверская, 7, офис 12." },
  { value: "payment", title: "2. Оплата", text: "Картой онлайн или по счёту для юрлиц." },
  { value: "confirm", title: "3. Подтверждение", text: "Проверьте состав заказа и сумму." },
];

export default function AccordionCollapsibleExample() {
  return (
    <div className={styles.panel}>
      <Accordion.Root layout="separate" defaultValue="address" collapsible={false}>
        {STEPS.map((step) => (
          <Accordion.Item key={step.value} value={step.value}>
            <Accordion.Header>
              <Accordion.Trigger>{step.title}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{step.text}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
