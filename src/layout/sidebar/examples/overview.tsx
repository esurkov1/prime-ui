/** App navigation on the canvas: a brand header with the collapse toggle, items with icons and the current page — `Sidebar.Brand`, `Sidebar.Toggle`, `Sidebar.ItemIcon`, `current`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarOverviewExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="never">
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
          <Sidebar.Item current>
            <Sidebar.ItemIcon>
              <Icon name="nav.home" />
            </Sidebar.ItemIcon>
            Обзор
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="object.users" />
            </Sidebar.ItemIcon>
            Клиенты
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="object.document" />
            </Sidebar.ItemIcon>
            Сделки
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
