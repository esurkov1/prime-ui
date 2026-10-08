/** A muted icon before the label and a hairline before the service section — `Tabs.Icon`, `Tabs.Label`, `Tabs.Separator`. */
import { Icon, Tabs, Typography } from "prime-ui-kit";

const SECTIONS = [
  { value: "overview", label: "Обзор", icon: "nav.home", text: "Выручка и заказы за неделю." },
  { value: "orders", label: "Заказы", icon: "object.package", text: "24 заказа ждут отгрузки." },
  { value: "invoices", label: "Счета", icon: "object.receipt", text: "3 счёта просрочены." },
] as const;

export default function TabsWithIconExample() {
  return (
    <Tabs.Root defaultValue="orders">
      <Tabs.List aria-label="Магазин">
        {SECTIONS.map((section) => (
          <Tabs.Item key={section.value} value={section.value}>
            <Tabs.Icon>
              <Icon name={section.icon} />
            </Tabs.Icon>
            <Tabs.Label>{section.label}</Tabs.Label>
          </Tabs.Item>
        ))}
        <Tabs.Separator />
        <Tabs.Item value="settings">
          <Tabs.Icon>
            <Icon name="action.settings" />
          </Tabs.Icon>
          <Tabs.Label>Настройки</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
      {SECTIONS.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
          <Typography variant="body-m" tone="secondary">
            {section.text}
          </Typography>
        </Tabs.Panel>
      ))}
      <Tabs.Panel value="settings">
        <Typography variant="body-m" tone="secondary">
          Реквизиты, уведомления и доступы сотрудников.
        </Typography>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
