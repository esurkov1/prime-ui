/** Several sections stay open at once; the value is a list — `multiple`. */
import { Accordion } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "profile", title: "Профиль", text: "Имя, фото и язык интерфейса." },
  {
    value: "notifications",
    title: "Уведомления",
    text: "Письма о заказах и сводка по понедельникам.",
  },
  { value: "integrations", title: "Интеграции", text: "1С, Битрикс24 и вебхуки." },
];

export default function AccordionMultipleExample() {
  return (
    <div className={styles.panel}>
      <Accordion.Root multiple defaultValue={["profile", "notifications"]}>
        {SECTIONS.map((section) => (
          <Accordion.Item key={section.value} value={section.value}>
            <Accordion.Header>
              <Accordion.Trigger>{section.title}</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{section.text}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
