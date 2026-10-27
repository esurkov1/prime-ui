/** An off-canvas panel only its own toggle closes: a press on the scrim and Escape leave it open, a picked item still closes it — `closeOnOutsideClick`, `closeOnEscape`. */
import { AppShell, Icon, Page, Sidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SidebarDismissExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root offCanvas="always" closeOnOutsideClick={false} closeOnEscape={false}>
            <Sidebar.Header>
              <Sidebar.Brand href="#home" description="Склад · смена 2">
                <Sidebar.BrandLogo>
                  <Icon name="object.package" />
                </Sidebar.BrandLogo>
                Терминал сборки
              </Sidebar.Brand>
              <Sidebar.Toggle variant="header" />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Item href="#picking" current>
                <Sidebar.ItemIcon>
                  <Icon name="object.tasks" />
                </Sidebar.ItemIcon>
                Сборка заказов
                <Sidebar.ItemCount>14</Sidebar.ItemCount>
              </Sidebar.Item>
              <Sidebar.Item href="#returns">
                <Sidebar.ItemIcon>
                  <Icon name="object.package" />
                </Sidebar.ItemIcon>
                Возвраты
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Heading>
                <Page.Title>Сборка заказов</Page.Title>
              </Page.Heading>
            </Page.TopBar>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
