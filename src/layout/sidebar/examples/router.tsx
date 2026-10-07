/** `asChild` with a router NavLink: the router sets `aria-current="page"` and the item shows as active. Use inside a react-router app; the links must be rendered within a router. */
import { LayoutTemplate, PanelLeft, PanelTop } from "lucide-react";
import { Sidebar } from "prime-ui-kit";
import { NavLink } from "react-router-dom";

import styles from "./examples.module.css";

export default function SidebarRouterExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          <Sidebar.Item asChild icon={<LayoutTemplate />}>
            <NavLink to="/app-shell">AppShell</NavLink>
          </Sidebar.Item>
          <Sidebar.Item asChild icon={<PanelTop />}>
            <NavLink to="/page-content">PageContent</NavLink>
          </Sidebar.Item>
          <Sidebar.Item asChild icon={<PanelLeft />}>
            <NavLink to="/sidebar">Sidebar</NavLink>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
