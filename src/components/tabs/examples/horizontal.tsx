/** Horizontal tabs: text over a hairline with a 2px accent bar under the active label that slides on change. Use to switch between panels of one screen. */
import { Tabs, Typography } from "prime-ui-kit";

const panels = [
  { value: "overview", label: "Обзор", text: "Сводка по магазину за выбранный период." },
  { value: "orders", label: "Заказы", text: "Последние заказы и их статусы." },
  { value: "reviews", label: "Отзывы", text: "Новые отзывы покупателей." },
  { value: "settings", label: "Настройки магазина", text: "Название, валюта и способы доставки." },
];

export default function TabsHorizontalExample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Магазин">
        {panels.map((p) => (
          <Tabs.Trigger key={p.value} value={p.value}>
            {p.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {panels.map((p) => (
        <Tabs.Panel key={p.value} value={p.value}>
          <Typography.Root variant="body-m" tone="secondary">
            {p.text}
          </Typography.Root>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
