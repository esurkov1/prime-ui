/** Everything the app navigation holds: brand and collapse toggle, groups that fold, a nested list, counts, the footer and the account — `Sidebar.Brand`, `Sidebar.Group`, `Sidebar.Sub`, `Sidebar.ItemCount`, `Sidebar.Account`, `Sidebar.Toggle`. */
import { Avatar, Dropdown, Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarOverviewExample() {
  return (
    <div className={`${styles.stage} ${styles.stageTall}`}>
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
          <Sidebar.Group>
            <Sidebar.Item current>
              <Sidebar.ItemIcon>
                <Icon name="nav.home" />
              </Sidebar.ItemIcon>
              Обзор
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.inbox" />
              </Sidebar.ItemIcon>
              Входящие
              <Sidebar.ItemCount color="blue">8</Sidebar.ItemCount>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Продажи" collapsible>
            <Sidebar.Sub defaultOpen>
              <Sidebar.SubTrigger>
                <Sidebar.ItemIcon>
                  <Icon name="object.document" />
                </Sidebar.ItemIcon>
                Сделки
              </Sidebar.SubTrigger>
              <Sidebar.SubContent>
                <Sidebar.Item>
                  Новые
                  <Sidebar.ItemCount>12</Sidebar.ItemCount>
                </Sidebar.Item>
                <Sidebar.Item>
                  В работе
                  <Sidebar.ItemCount>5</Sidebar.ItemCount>
                </Sidebar.Item>
                <Sidebar.Item>Закрытые</Sidebar.Item>
              </Sidebar.SubContent>
            </Sidebar.Sub>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.users" />
              </Sidebar.ItemIcon>
              Клиенты
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Поддержка" collapsible defaultOpen={false}>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.message" />
              </Sidebar.ItemIcon>
              Обращения
              <Sidebar.ItemCount color="red">3</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.book" />
              </Sidebar.ItemIcon>
              База знаний
            </Sidebar.Item>
          </Sidebar.Group>
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
                  <Icon name="object.user" />
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
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="action.logout" />
                </Dropdown.ItemIcon>
                Выйти
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
