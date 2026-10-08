/** Four sections of the app, the current one in the primary color and a tap moves it — `current`, `BottomNav.ItemIcon`. */
import { BottomNav, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { id: "home", label: "Главная", icon: "nav.home", summary: "Выручка за неделю — 1,2 млн ₽" },
  { id: "orders", label: "Заказы", icon: "object.package", summary: "37 заказов ждут отгрузки" },
  { id: "clients", label: "Клиенты", icon: "object.users", summary: "214 активных клиентов" },
  { id: "settings", label: "Настройки", icon: "action.settings", summary: "Профиль и уведомления" },
] as const;

export default function BottomNavOverviewExample() {
  const [section, setSection] = React.useState<string>("orders");
  const current = SECTIONS.find((item) => item.id === section) ?? SECTIONS[0];

  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <Typography as="h2" variant="title-m">
          {current.label}
        </Typography>
        <Typography variant="body-m" tone="secondary">
          {current.summary}
        </Typography>
      </div>
      <BottomNav.Root>
        {SECTIONS.map((item) => (
          <BottomNav.Item
            key={item.id}
            current={item.id === section}
            onClick={() => setSection(item.id)}
          >
            <BottomNav.ItemIcon>
              <Icon name={item.icon} />
            </BottomNav.ItemIcon>
            {item.label}
          </BottomNav.Item>
        ))}
      </BottomNav.Root>
    </div>
  );
}
