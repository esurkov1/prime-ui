/** A parent item with child items on a guide line: a current child opens it and marks the parent; on the compact rail the children open in a flyout — `Sidebar.Sub`, `Sidebar.SubTrigger`, `Sidebar.SubContent`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

const STAGES = [
  { href: "#backlog", label: "Бэклог", count: 24 },
  { href: "#in-progress", label: "В работе", count: 4 },
  { href: "#review", label: "На проверке", count: 7, current: true },
  { href: "#done", label: "Готово", count: 13 },
];

export default function SidebarNestedItemsExample() {
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
          <Sidebar.Item href="#overview">
            <Sidebar.ItemIcon>
              <Icon name="nav.home" />
            </Sidebar.ItemIcon>
            Обзор
          </Sidebar.Item>
          <Sidebar.Sub>
            <Sidebar.SubTrigger>
              <Sidebar.ItemIcon>
                <Icon name="object.tasks" />
              </Sidebar.ItemIcon>
              Задачи
            </Sidebar.SubTrigger>
            <Sidebar.SubContent>
              {STAGES.map((stage) => (
                <Sidebar.Item key={stage.href} href={stage.href} current={stage.current}>
                  {stage.label}
                  <Sidebar.ItemCount>{stage.count}</Sidebar.ItemCount>
                </Sidebar.Item>
              ))}
            </Sidebar.SubContent>
          </Sidebar.Sub>
          <Sidebar.Sub>
            <Sidebar.SubTrigger>
              <Sidebar.ItemIcon>
                <Icon name="object.users" />
              </Sidebar.ItemIcon>
              Клиенты
            </Sidebar.SubTrigger>
            <Sidebar.SubContent>
              <Sidebar.Item href="#companies">Компании</Sidebar.Item>
              <Sidebar.Item href="#contacts">Контакты</Sidebar.Item>
            </Sidebar.SubContent>
          </Sidebar.Sub>
          <Sidebar.Item href="#calendar">
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
