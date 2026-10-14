/** A router link as the item: the router marks the open section and the item shows it as current; render it inside a router — `asChild`. */
import { BottomNav, Icon } from "prime-ui-kit";
import { NavLink } from "react-router-dom";

import styles from "./examples.module.css";

const LINKS = [
  { to: "/", label: "Главная", icon: "nav.home" },
  { to: "/orders", label: "Заказы", icon: "object.package" },
  { to: "/clients", label: "Клиенты", icon: "object.users" },
  { to: "/settings", label: "Настройки", icon: "action.settings" },
] as const;

export default function BottomNavRouterExample() {
  return (
    <div className={styles.phone}>
      <div className={styles.screen} />
      <BottomNav.Root>
        {LINKS.map((link) => (
          <BottomNav.Item key={link.to} asChild>
            <NavLink to={link.to} end>
              <BottomNav.ItemIcon>
                <Icon name={link.icon} />
              </BottomNav.ItemIcon>
              {link.label}
            </NavLink>
          </BottomNav.Item>
        ))}
      </BottomNav.Root>
    </div>
  );
}
