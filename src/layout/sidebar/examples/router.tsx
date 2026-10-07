/** A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. */
import { Icon, Sidebar } from "prime-ui-kit";
import { NavLink } from "react-router-dom";

import styles from "./examples.module.css";

const LINKS = [
  { to: "/app-shell", label: "AppShell" },
  { to: "/page-content", label: "PageContent" },
  { to: "/sidebar", label: "Sidebar" },
];

export default function SidebarRouterExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          {LINKS.map((link) => (
            <Sidebar.Item key={link.to} asChild>
              <NavLink to={link.to}>
                <Sidebar.ItemIcon>
                  <Icon name="nav.layoutGrid" />
                </Sidebar.ItemIcon>
                {link.label}
              </NavLink>
            </Sidebar.Item>
          ))}
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
