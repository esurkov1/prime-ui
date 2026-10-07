/** One surface with hairlines between items, or every item as its own card — `layout`. */
import { Accordion, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const LAYOUTS = ["grouped", "separate"] as const;

const SECTIONS = [
  { value: "plan", title: "Тариф", text: "«Бизнес», продление 12 ноября." },
  { value: "invoices", title: "Счета", text: "Последний счёт оплачен 1 октября." },
];

export default function AccordionVariantsExample() {
  return (
    <>
      {LAYOUTS.map((layout) => (
        <div key={layout} className={styles.panel}>
          <Typography as="span" variant="caption" tone="muted">
            {layout}
          </Typography>
          <Accordion.Root layout={layout} defaultValue="plan">
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
      ))}
    </>
  );
}
