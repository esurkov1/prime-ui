/** A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. */
import { BottomNav, Icon } from "prime-ui-kit";
import { NavLink } from "react-router-dom";

import styles from "./examples.module.css";

const LINKS = [
  { to: "/app-shell", label: "Каркас", icon: "nav.layoutGrid" },
  { to: "/bottom-nav", label: "Навигация", icon: "nav.menu" },
  { to: "/sidebar", label: "Сайдбар", icon: "nav.sidebarExpand" },
] as const;

export default function BottomNavRouterExample() {
  return (
    <div className={styles.phone}>
      <div className={styles.screen} />
      <BottomNav.Root>
        {LINKS.map((link) => (
          <BottomNav.Item key={link.to} asChild>
            <NavLink to={link.to}>
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
