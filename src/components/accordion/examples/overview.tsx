/** A FAQ where one answer is open at a time — `defaultValue`. */
import { Accordion } from "prime-ui-kit";

import styles from "./examples.module.css";

const FAQ = [
  {
    value: "delivery",
    question: "Сколько идёт доставка?",
    answer: "По Москве — 1–2 дня, по России — от 3 до 7 рабочих дней.",
  },
  {
    value: "return",
    question: "Как вернуть товар?",
    answer: "Оформите возврат в личном кабинете в течение 14 дней после получения.",
  },
  {
    value: "payment",
    question: "Какие способы оплаты есть?",
    answer: "Карта, СБП и счёт для юрлиц. Оплата при получении — в пунктах выдачи.",
  },
];

export default function AccordionOverviewExample() {
  return (
    <div className={styles.panel}>
      <Accordion.Root defaultValue="delivery">
        {FAQ.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Header>
              <Accordion.Trigger>{item.question}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{item.answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
