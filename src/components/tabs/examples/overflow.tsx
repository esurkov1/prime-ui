/** More tabs than fit a phone-width column: the list scrolls with faded edges and keeps the active tab in view. */
import { Tabs } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "general", label: "Общие" },
  { value: "team", label: "Команда" },
  { value: "notifications", label: "Уведомления" },
  { value: "integrations", label: "Интеграции" },
  { value: "billing", label: "Оплата" },
  { value: "api", label: "API" },
];

export default function TabsOverflowExample() {
  return (
    <div className={styles.narrow}>
      <Tabs.Root defaultValue="notifications">
        <Tabs.List aria-label="Настройки">
          {SECTIONS.map((section) => (
            <Tabs.Item key={section.value} value={section.value}>
              {section.label}
            </Tabs.Item>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
}
