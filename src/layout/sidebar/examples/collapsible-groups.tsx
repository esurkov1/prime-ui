/** Group headings that fold their items away, with a chevron at the end of the heading; on the compact rail a folded group becomes one row whose items open in a flyout — `collapsible`, `defaultOpen`. */
import { Icon, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarCollapsibleGroupsExample() {
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
          <Sidebar.Group label="Обзор" collapsible>
            <Sidebar.Item current>
              <Sidebar.ItemIcon>
                <Icon name="nav.home" />
              </Sidebar.ItemIcon>
              Сводка
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.bell" />
              </Sidebar.ItemIcon>
              Уведомления
              <Sidebar.ItemCount color="red">7</Sidebar.ItemCount>
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Инструменты" collapsible>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.tasks" />
              </Sidebar.ItemIcon>
              Задачи
              <Sidebar.ItemCount>48</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="field.calendar" />
              </Sidebar.ItemIcon>
              Календарь
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.users" />
              </Sidebar.ItemIcon>
              Клиенты
            </Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label="Метрики" collapsible defaultOpen={false}>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.chart" />
              </Sidebar.ItemIcon>
              Воронка продаж
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="object.document" />
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
