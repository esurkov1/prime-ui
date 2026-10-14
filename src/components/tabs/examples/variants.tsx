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
    <div>
      {TONES.map((tone) => (
        <div key={tone}>
          <Tabs.Root tone={tone} defaultValue="orders">
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
          </Tabs.Root>
          <Typography as="span" variant="caption" tone="muted">
            {tone}
          </Typography>
        </div>
      ))}
    </div>
  );
}
