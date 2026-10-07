/** Labelled groups and the optional item parts: a counter, a key hint and a disabled section — `Sidebar.Group`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `disabled`. */
import { Icon, Kbd, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarStructureExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="action.search" />
              </Sidebar.ItemIcon>
              Поиск
              <Sidebar.ItemShortcut>
                <Kbd>⌘K</Kbd>
              </Sidebar.ItemShortcut>
            </Sidebar.Item>
            <Sidebar.Item current>
              <Sidebar.ItemIcon>
                <Icon name="nav.home" />
              </Sidebar.ItemIcon>
              Главная
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="field.email" />
              </Sidebar.ItemIcon>
              Входящие
              <Sidebar.ItemCount>12</Sidebar.ItemCount>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Администрирование">
            <Sidebar.Item disabled>
              <Sidebar.ItemIcon>
                <Icon name="status.locked" />
              </Sidebar.ItemIcon>
              Доступы
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="nav.layoutGrid" />
              </Sidebar.ItemIcon>
              Отчёты
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
