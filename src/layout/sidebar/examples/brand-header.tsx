/** A brand block with the collapse toggle at the end of the header; in compact mode the logo stays and the toggle moves onto the rail edge — `Sidebar.Brand`, `Sidebar.BrandLogo`, `description`, `variant`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarBrandHeaderExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
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
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
