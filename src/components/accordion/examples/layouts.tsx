/** FAQ in both layouts: `grouped` (one surface with hairlines between items) and `separate` (each item its own card). Pick grouped for lists of short answers, separate for heavier sections. */
import { Accordion, Typography } from "prime-ui-kit";
import styles from "./examples.module.css";

const faq = [
  {
    id: "delivery",
    q: "Сколько идёт доставка?",
    a: "По Москве — 1–2 дня, по России — от 3 до 7 рабочих дней.",
  },
  {
    id: "return",
    q: "Как вернуть товар?",
    a: "Оформите возврат в личном кабинете в течение 14 дней после получения.",
  },
  {
    id: "pay",
    q: "Какие способы оплаты есть?",
    a: "Карта, СБП и счёт для юрлиц. Оплата при получении — в пунктах выдачи.",
  },
];

function Faq({ layout }: { layout: "grouped" | "separate" }) {
  return (
    <Accordion.Root layout={layout} defaultValue="delivery">
      {faq.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger>
              <span>{item.q}</span>
              <Accordion.Arrow />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{item.a}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export default function AccordionLayoutsExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          layout="grouped"
        </Typography.Root>
        <Faq layout="grouped" />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          layout="separate"
        </Typography.Root>
        <Faq layout="separate" />
      </div>
    </div>
  );
}
