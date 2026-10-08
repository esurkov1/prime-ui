/** Drag the frame narrower: icons go first, then labels, and icons with tooltips stay; then the list scrolls — `Tabs.Icon`. */
import { Icon, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  {
    value: "overview",
    label: "Обзор",
    icon: "nav.home",
    count: 0,
    text: "Выручка за октябрь — 4 812 300 ₽.",
  },
  {
    value: "orders",
    label: "Заказы",
    icon: "object.package",
    count: 24,
    text: "24 заказа ждут отгрузки.",
  },
  {
    value: "invoices",
    label: "Счета",
    icon: "object.receipt",
    count: 3,
    text: "3 счёта просрочены.",
  },
  {
    value: "clients",
    label: "Клиенты",
    icon: "object.users",
    count: 0,
    text: "312 активных компаний.",
  },
] as const;

export default function TabsOverflowExample() {
  return (
    <Tabs.Root defaultValue="orders" className={styles.resizable}>
      <Tabs.List aria-label="Магазин">
        {SECTIONS.map((section) => (
          <Tabs.Item key={section.value} value={section.value}>
            <Tabs.Icon>
              <Icon name={section.icon} />
            </Tabs.Icon>
            <Tabs.Label>{section.label}</Tabs.Label>
            {section.count > 0 ? <Tabs.Count>{section.count}</Tabs.Count> : null}
          </Tabs.Item>
        ))}
      </Tabs.List>
      {SECTIONS.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
          <Typography variant="body-m" tone="secondary">
            {section.text}
          </Typography>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
