/** A muted icon before the label; the active tab's icon turns accent — `Tabs.Icon`, `Tabs.Label`. */
import { Icon, Tabs } from "prime-ui-kit";

const SECTIONS = [
  { value: "overview", label: "Обзор", icon: "nav.layoutGrid" },
  { value: "calendar", label: "Календарь", icon: "field.calendar" },
  { value: "mail", label: "Рассылки", icon: "field.email" },
  { value: "access", label: "Доступ", icon: "status.locked" },
] as const;

export default function TabsWithIconExample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Проект">
        {SECTIONS.map((section) => (
          <Tabs.Item key={section.value} value={section.value}>
            <Tabs.Icon>
              <Icon name={section.icon} />
            </Tabs.Icon>
            <Tabs.Label>{section.label}</Tabs.Label>
          </Tabs.Item>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
