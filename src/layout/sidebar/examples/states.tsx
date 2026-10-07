/** Item states: active (surface + shadow), hover wash, badge, keyboard hint and disabled, in labelled groups. Use as the reference for navigation items. */
import { Archive, Home, Inbox, Search, Settings } from "lucide-react";
import { Kbd, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarStatesExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Item icon={<Search />} shortcut={<Kbd>⌘K</Kbd>}>
              Поиск
            </Sidebar.Item>
            <Sidebar.Item icon={<Home />} active>
              Главная
            </Sidebar.Item>
            <Sidebar.Item icon={<Inbox />} badge={12}>
              Входящие
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Ещё">
            <Sidebar.Item icon={<Archive />} disabled>
              Архив
            </Sidebar.Item>
            <Sidebar.Item icon={<Settings />}>Настройки</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
