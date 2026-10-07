/** App navigation on the canvas: items with icons, the current page and a collapse toggle — `Sidebar.ItemIcon`, `current`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarOverviewExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
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
        <Sidebar.Footer>
          <Sidebar.Toggle />
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
