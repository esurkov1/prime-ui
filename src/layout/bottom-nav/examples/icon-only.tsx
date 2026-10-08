/** Icons alone: the labels are hidden but still name the sections for screen readers — `iconOnly`. */
import { BottomNav, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { id: "home", label: "Главная", icon: "nav.home" },
  { id: "orders", label: "Заказы", icon: "object.package" },
  { id: "inbox", label: "Входящие", icon: "object.inbox" },
  { id: "profile", label: "Профиль", icon: "object.user" },
] as const;

export default function BottomNavIconOnlyExample() {
  const [section, setSection] = React.useState<string>("home");
  const current = SECTIONS.find((item) => item.id === section) ?? SECTIONS[0];

  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <Typography as="h2" variant="title-m">
          {current.label}
        </Typography>
      </div>
      <BottomNav.Root iconOnly>
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
