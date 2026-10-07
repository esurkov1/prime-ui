/** Below 768px the rail becomes an off-canvas panel with a scrim, opened from a menu button; narrow the window to try it — `open`, `onOpenChange`. */
import { Button, Icon, Sidebar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SidebarControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.stage}>
      <Sidebar.Root open={open} onOpenChange={setOpen}>
        <Sidebar.Content>
          <Sidebar.Item href="#home" current>
            <Sidebar.ItemIcon>
              <Icon name="nav.home" />
            </Sidebar.ItemIcon>
            Главная
          </Sidebar.Item>
          <Sidebar.Item href="#inbox">
            <Sidebar.ItemIcon>
              <Icon name="field.email" />
            </Sidebar.ItemIcon>
            Входящие
            <Sidebar.ItemCount>2</Sidebar.ItemCount>
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
            <Icon name="nav.sidebarExpand" />
          </Button.Icon>
          Меню
        </Button.Root>
      </div>
    </div>
  );
}
