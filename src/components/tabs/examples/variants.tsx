/** The active tab in primary text with an accent icon, or all in accent — `tone`. */
import { Icon, Tabs, Typography } from "prime-ui-kit";

const TONES = ["neutral", "accent"] as const;

const SECTIONS = [
  { value: "orders", label: "Заказы", icon: "object.package" },
  { value: "invoices", label: "Счета", icon: "object.receipt" },
  { value: "clients", label: "Клиенты", icon: "object.users" },
] as const;

export default function TabsVariantsExample() {
  return (
    <>
      {TONES.map((tone) => (
        <Tabs.Root key={tone} tone={tone} defaultValue="orders">
          <Tabs.List aria-label="Продажи">
            {SECTIONS.map((section) => (
              <Tabs.Item key={section.value} value={section.value}>
                <Tabs.Icon>
                  <Icon name={section.icon} />
                </Tabs.Icon>
                <Tabs.Label>{section.label}</Tabs.Label>
              </Tabs.Item>
            ))}
          </Tabs.List>
          {SECTIONS.map((section) => (
            <Tabs.Panel key={section.value} value={section.value}>
              <Typography variant="body-m" tone="secondary">
                {tone === "neutral"
                  ? "Спокойный акцент: цвет только у иконки."
                  : "Активная вкладка целиком в акцентном цвете."}
              </Typography>
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      ))}
    </>
  );
}
