/** The signed-in person opens a profile panel, not a menu, so the row draws no chevron — `Sidebar.Account`, `description`. */
import { Avatar, Button, DescriptionList, Drawer, Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

const PROFILE = [
  { term: "Почта", value: "anna@company.ru" },
  { term: "Роль", value: "Руководитель отдела продаж" },
  { term: "Часовой пояс", value: "Москва, UTC+3" },
];

export default function SidebarAccountProfileExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="never">
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
          <Drawer.Root>
            <Drawer.Trigger>
              <Sidebar.Account description="anna@company.ru">
                <Avatar.Root color="purple">
                  <Avatar.Fallback>АС</Avatar.Fallback>
                </Avatar.Root>
                Анна Смирнова
              </Sidebar.Account>
            </Drawer.Trigger>
            <Drawer.Content size="s">
              <Drawer.Header>
                <Drawer.Title>Анна Смирнова</Drawer.Title>
                <Drawer.Description>Профиль</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <DescriptionList.Root>
                  {PROFILE.map(({ term, value }) => (
                    <DescriptionList.Item key={term} label={term}>
                      {value}
                    </DescriptionList.Item>
                  ))}
                </DescriptionList.Root>
              </Drawer.Body>
              <Drawer.Footer>
                <Button.Root variant="outline" tone="neutral">
                  Выйти
                </Button.Root>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
