/** Tabs over the panel and a side list of sections that stacks on top below 600px — `orientation`. */
import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "profile", label: "Профиль", text: "Имя, должность и контакты сотрудника." },
  { value: "notifications", label: "Уведомления", text: "Письма о заказах и еженедельная сводка." },
  { value: "deletion", label: "Удаление", text: "Аккаунт и все данные будут удалены." },
];

export default function TabsOrientationExample() {
  return (
    <>
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Tabs.Root
          key={orientation}
          orientation={orientation}
          defaultValue="notifications"
          className={styles.wide}
        >
          <Tabs.List aria-label="Настройки">
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
      ))}
    </>
  );
}
