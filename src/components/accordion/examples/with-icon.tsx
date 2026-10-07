/** A leading icon per section; the content lines up with the label after it — `Accordion.Icon`. */
import { Accordion, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  {
    value: "calendar",
    title: "Расписание отчётов",
    icon: "field.calendar",
    text: "Сводка уходит по понедельникам в 9:00.",
  },
  {
    value: "mail",
    title: "Рассылки",
    icon: "field.email",
    text: "Письма о новых заказах и возвратах.",
  },
  {
    value: "access",
    title: "Доступ",
    icon: "status.locked",
    text: "Кто из команды видит финансовые отчёты.",
  },
] as const;

export default function AccordionWithIconExample() {
  return (
    <div className={styles.panel}>
      <Accordion.Root defaultValue="calendar">
        {SECTIONS.map((section) => (
          <Accordion.Item key={section.value} value={section.value}>
            <Accordion.Header>
              <Accordion.Trigger>
                <Accordion.Icon>
                  <Icon name={section.icon} />
                </Accordion.Icon>
                {section.title}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>{section.text}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
