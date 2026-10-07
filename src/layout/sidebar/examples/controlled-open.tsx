/** Navigation behind a menu button at any width: the parent opens the off-canvas panel, the scrim, Escape, the header toggle or a navigation closes it — `offCanvas`, `open`, `onOpenChange`. */
import { Button, Icon, Sidebar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SidebarControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="always" open={open} onOpenChange={setOpen}>
        <Sidebar.Header>
          <Sidebar.Brand href="#home" description="Отдел продаж">
            <Sidebar.BrandLogo>
              <span className={styles.logo}>
                <Icon name="nav.layoutGrid" />
              </span>
            </Sidebar.BrandLogo>
            Прайм CRM
          </Sidebar.Brand>
          <Sidebar.Toggle variant="header" />
        </Sidebar.Header>
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
