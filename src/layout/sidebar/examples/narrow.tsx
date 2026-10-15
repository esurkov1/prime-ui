/** Below 768px the rail leaves the layout and slides in over the page from the menu button the page top bar draws by itself; from 768px it is the rail again, and the button leaves — `AppShell`, `labels`. */
import { AppShell, Icon, Page, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

const LABELS = { close: "Закрыть меню" };

export default function SidebarNarrowExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root labels={LABELS}>
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
              <Sidebar.Item href="#deals" current>
                <Sidebar.ItemIcon>
                  <Icon name="object.document" />
                </Sidebar.ItemIcon>
                Сделки
              </Sidebar.Item>
              <Sidebar.Item href="#clients">
                <Sidebar.ItemIcon>
                  <Icon name="object.users" />
                </Sidebar.ItemIcon>
                Клиенты
              </Sidebar.Item>
              <Sidebar.Item href="#tasks">
                <Sidebar.ItemIcon>
                  <Icon name="object.tasks" />
                </Sidebar.ItemIcon>
                Задачи
                <Sidebar.ItemCount>5</Sidebar.ItemCount>
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Header>
                <Page.Title>Сделки</Page.Title>
              </Page.Header>
            </Page.TopBar>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
