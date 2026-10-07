/** Footer items above the signed-in person: avatar, name and email open the account menu; in compact mode only the avatar stays — `Sidebar.Footer`, `Sidebar.Account`, `description`. */
import { Avatar, Dropdown, Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarAccountExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root responsive={false}>
        <Sidebar.Content>
          <Sidebar.Item current>
            <Sidebar.ItemIcon>
              <Icon name="nav.home" />
            </Sidebar.ItemIcon>
            Обзор
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="object.document" />
            </Sidebar.ItemIcon>
            Сделки
          </Sidebar.Item>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Item href="#help" target="_blank" rel="noreferrer">
            <Sidebar.ItemIcon>
              <Icon name="status.info" />
            </Sidebar.ItemIcon>
            Справка
            <Sidebar.ItemIcon>
              <Icon name="action.externalLink" />
            </Sidebar.ItemIcon>
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="action.settings" />
            </Sidebar.ItemIcon>
            Настройки
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="object.users" />
            </Sidebar.ItemIcon>
            Пригласить команду
          </Sidebar.Item>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Sidebar.Account description="anna@company.ru">
                <Avatar.Root color="purple">
                  <Avatar.Fallback>АС</Avatar.Fallback>
                </Avatar.Root>
                Анна Смирнова
              </Sidebar.Account>
            </Dropdown.Trigger>
            <Dropdown.Content side="right" align="end">
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="object.users" />
                </Dropdown.ItemIcon>
                Профиль
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="action.settings" />
                </Dropdown.ItemIcon>
                Настройки аккаунта
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item>Выйти</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
