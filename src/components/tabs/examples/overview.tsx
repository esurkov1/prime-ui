/** Sections of one screen; the accent bar slides to the active tab — `defaultValue`. */
import { Tabs, Typography } from "prime-ui-kit";

const SECTIONS = [
  { value: "overview", label: "Обзор", text: "Сводка по магазину за выбранный период." },
  { value: "orders", label: "Заказы", text: "Последние заказы и их статусы." },
  { value: "reviews", label: "Отзывы", text: "Новые отзывы покупателей." },
  { value: "settings", label: "Настройки", text: "Название, валюта и способы доставки." },
];

export default function TabsOverviewExample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Магазин">
        {SECTIONS.map((section) => (
          <Tabs.Item key={section.value} value={section.value}>
            {section.label}
          </Tabs.Item>
        ))}
      </Tabs.List>
      {SECTIONS.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
          <Typography.Root variant="body-m" tone="secondary">
            {section.text}
          </Typography.Root>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
