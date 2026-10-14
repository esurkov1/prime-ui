/** The first visit opens on the icon rail; the mode and the folded groups are remembered and come back after a reload — `persistKey`, `defaultMode`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarPersistExample() {
  return (
    <div className={`${styles.stage} ${styles.stageTall}`}>
      <Sidebar.Root offCanvas="never" defaultMode="compact" persistKey="crm-navigation">
        <Sidebar.Header>
          <Sidebar.Brand href="#home" description="Отдел продаж">
            <Sidebar.BrandLogo>
              <Icon name="nav.layoutGrid" />
            </Sidebar.BrandLogo>
            Прайм CRM
          </Sidebar.Brand>
          <Sidebar.Toggle variant="header" />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group label="Продажи" collapsible>
            <Sidebar.Item current>
              <Sidebar.ItemIcon>
                <Icon name="object.document" />
              </Sidebar.ItemIcon>
              Сделки
              <Sidebar.ItemCount>24</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.users" />
              </Sidebar.ItemIcon>
              Клиенты
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Финансы" collapsible defaultOpen={false}>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.receipt" />
              </Sidebar.ItemIcon>
              Счета
              <Sidebar.ItemCount color="orange">2</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.wallet" />
              </Sidebar.ItemIcon>
              Платежи
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
