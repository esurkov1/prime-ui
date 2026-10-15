/** The app frame: Sidebar in the nav column, the page in main with its title and action in its top bar; only main scrolls — `fillViewport`. */
import { AppShell, Button, Icon, Page, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppShellOverviewExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          {/* A small app window: the icon rail fits every frame width; the toggle widens it. */}
          <Sidebar.Root offCanvas="never" defaultMode="compact">
            <Sidebar.Header>
              <Sidebar.Brand href="#home" description="Отдел продаж">
                <Sidebar.BrandLogo>
                  <Icon name="nav.layoutGrid" />
                </Sidebar.BrandLogo>
                Acme CRM
              </Sidebar.Brand>
              <Sidebar.Toggle variant="header" />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Item current>
                <Sidebar.ItemIcon>
                  <Icon name="nav.home" />
                </Sidebar.ItemIcon>
                Обзор
              </Sidebar.Item>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <Icon name="nav.layoutGrid" />
                </Sidebar.ItemIcon>
                Отчёты
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Header>
                <Page.Title>Обзор</Page.Title>
                <Page.Description>Октябрь · 37 сделок в работе</Page.Description>
                <Page.Actions>
                  <Button.Root>
                    <Button.Icon>
                      <Icon name="action.add" />
                    </Button.Icon>
                    Новая сделка
                  </Button.Root>
                </Page.Actions>
              </Page.Header>
            </Page.TopBar>
            <Page.Body>
              <Typography variant="body-m" tone="secondary">
                Выручка за месяц — 4,8 млн ₽, на 12% больше, чем в сентябре.
              </Typography>
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
