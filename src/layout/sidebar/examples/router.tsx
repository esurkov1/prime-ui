/** Router links as the brand and the items: the router marks the current link and the item shows it as current; render it inside a router — `asChild`. */
import { Icon, type IconName, Sidebar } from "prime-ui-kit";
import { Link, NavLink } from "react-router-dom";

import styles from "./examples.module.css";

const LINKS: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Обзор", icon: "nav.home" },
  { to: "/deals", label: "Сделки", icon: "object.funnel" },
  { to: "/clients", label: "Клиенты", icon: "object.users" },
];

export default function SidebarRouterExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="never">
        <Sidebar.Header>
          <Sidebar.Brand asChild description="Отдел продаж">
            <Link to="/">
              <Sidebar.BrandLogo>
                <Icon name="nav.layoutGrid" />
              </Sidebar.BrandLogo>
              Прайм CRM
            </Link>
          </Sidebar.Brand>
        </Sidebar.Header>
        <Sidebar.Content>
          {LINKS.map((link) => (
            <Sidebar.Item key={link.to} asChild>
              {/* `end`: the overview is current only on its own page, not under every route. */}
              <NavLink to={link.to} end={link.to === "/"}>
                <Sidebar.ItemIcon>
                  <Icon name={link.icon} />
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
