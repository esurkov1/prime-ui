/** Below 768px the rail leaves the layout and slides in over the page from the menu button; from 768px it is the rail again, and the button leaves — `offCanvas`, `labels`. */
import { AppHeader, Icon, Sidebar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LABELS = { close: "Закрыть меню" };

export default function SidebarNarrowExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.stage}>
      <Sidebar.Root open={open} onOpenChange={setOpen} labels={LABELS}>
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
          <Sidebar.Item href="#deals" current>
            <Sidebar.ItemIcon>
              <Icon name="object.document" />
            </Sidebar.ItemIcon>
            Сделки
          </Sidebar.Item>
          <Sidebar.Item href="#clients">
            <Sidebar.ItemIcon>
              <Icon name="object.users" />
            </Sidebar.ItemIcon>
            Клиенты
          </Sidebar.Item>
          <Sidebar.Item href="#tasks">
            <Sidebar.ItemIcon>
              <Icon name="object.tasks" />
            </Sidebar.ItemIcon>
            Задачи
            <Sidebar.ItemCount>5</Sidebar.ItemCount>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content}>
        <AppHeader.MenuButton aria-expanded={open} onClick={() => setOpen(true)} />
      </div>
    </div>
  );
}
