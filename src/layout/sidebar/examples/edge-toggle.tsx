/** A small round toggle across the rail's outer edge, level with the header; its chevron turns with the mode — `Sidebar.Toggle`, `variant`. */
import { Icon, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarEdgeToggleExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Header>
          <Typography.Root as="span" variant="title-s">
            Склад
          </Typography.Root>
          <Sidebar.Toggle variant="edge" />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Item current>
            <Sidebar.ItemIcon>
              <Icon name="nav.home" />
            </Sidebar.ItemIcon>
            Главная
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="nav.layoutGrid" />
            </Sidebar.ItemIcon>
            Отчёты
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="field.calendar" />
            </Sidebar.ItemIcon>
            Календарь
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
