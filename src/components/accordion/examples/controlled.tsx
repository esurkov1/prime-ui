/** The parent owns the open sections and opens or closes all of them at once — `value`, `onValueChange`. */
import { Accordion, Button } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "general", title: "Общие", text: "Название компании, часовой пояс и валюта." },
  { value: "team", title: "Команда", text: "12 сотрудников, 3 приглашения ждут ответа." },
  { value: "billing", title: "Оплата", text: "Тариф «Бизнес», следующий счёт 12 ноября." },
];

const ALL = SECTIONS.map((section) => section.value);

export default function AccordionControlledExample() {
  const [open, setOpen] = React.useState<string[]>(["general"]);
  const allOpen = open.length === ALL.length;

  return (
    <div className={styles.panel}>
      <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(allOpen ? [] : ALL)}>
        {allOpen ? "Свернуть все" : "Развернуть все"}
      </Button.Root>
      <Accordion.Root multiple value={open} onValueChange={setOpen}>
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
