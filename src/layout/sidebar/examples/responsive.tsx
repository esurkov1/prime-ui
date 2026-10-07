/** Below 768px (`responsive`, default) the rail becomes an off-canvas panel with a scrim, focus trap and Escape, driven by `open` / `onOpenChange` from a menu button. Narrow the window to try it. */
import { Home, Inbox, Menu, Settings } from "lucide-react";
import { Button, Sidebar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SidebarResponsiveExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.stage}>
      <Sidebar.Root open={open} onOpenChange={setOpen}>
        <Sidebar.Content>
          <Sidebar.Item icon={<Home />} href="#home" active>
            Главная
          </Sidebar.Item>
          <Sidebar.Item icon={<Inbox />} href="#inbox" badge={2}>
            Входящие
          </Sidebar.Item>
          <Sidebar.Item icon={<Settings />} href="#settings">
            Настройки
          </Sidebar.Item>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Toggle />
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content}>
        <Button.Root
          variant="soft"
          tone="neutral"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Button.Icon>
            <Menu />
          </Button.Icon>
          Меню
        </Button.Root>
      </div>
    </div>
  );
}
