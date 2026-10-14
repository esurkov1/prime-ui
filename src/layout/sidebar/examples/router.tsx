/** Router links as the brand and the items: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. */
import { Icon, Sidebar } from "prime-ui-kit";
import { Link, NavLink } from "react-router-dom";

import styles from "./examples.module.css";

const LINKS = [
  { to: "/app-shell", label: "AppShell" },
  { to: "/page-content", label: "PageContent" },
  { to: "/sidebar", label: "Sidebar" },
];

export default function SidebarRouterExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="never">
        <Sidebar.Header>
          <Sidebar.Brand asChild description="Документация">
            <Link to="/">
              <Sidebar.BrandLogo>
                <span className={styles.logo}>
                  <Icon name="object.book" />
                </span>
              </Sidebar.BrandLogo>
              Prime UI
            </Link>
          </Sidebar.Brand>
        </Sidebar.Header>
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
