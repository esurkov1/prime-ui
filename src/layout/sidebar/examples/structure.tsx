/** Labelled groups and the optional item parts: a plain count, coloured and solid badges, a key hint, a trailing icon, row actions with the default and an own glyph and a disabled section — `Sidebar.Group`, `Sidebar.ItemCount`, `color`, `variant`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`, `disabled`. */
import { Icon, Kbd, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarStructureExample() {
  return (
    <div className={`${styles.stage} ${styles.stageTall}`}>
      <Sidebar.Root offCanvas="never">
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
              Обзор
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.bell" />
              </Sidebar.ItemIcon>
              Уведомления
              <Sidebar.ItemCount color="red" variant="solid">
                7
              </Sidebar.ItemCount>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Работа">
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.document" />
              </Sidebar.ItemIcon>
              Сделки
              <Sidebar.ItemCount>24</Sidebar.ItemCount>
              <Sidebar.ItemAction label="Создать сделку" onClick={() => {}} />
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="field.calendar" />
              </Sidebar.ItemIcon>
              Встречи
              <Sidebar.ItemCount color="green">3</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.package" />
              </Sidebar.ItemIcon>
              Интеграции
              <Sidebar.ItemCount color="orange">!</Sidebar.ItemCount>
              <Sidebar.ItemAction label="Синхронизировать интеграции" onClick={() => {}}>
                <Icon name="action.refresh" />
              </Sidebar.ItemAction>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Администрирование">
            <Sidebar.Item disabled>
              <Sidebar.ItemIcon>
                <Icon name="status.locked" />
              </Sidebar.ItemIcon>
              Доступы
            </Sidebar.Item>
            <Sidebar.Item href="#help" target="_blank" rel="noreferrer">
              <Sidebar.ItemIcon>
                <Icon name="status.info" />
              </Sidebar.ItemIcon>
              Справка
              <Sidebar.ItemIcon>
                <Icon name="action.externalLink" />
              </Sidebar.ItemIcon>
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
