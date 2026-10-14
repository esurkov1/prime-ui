/** The app frame: Sidebar in the nav column, the page title and its action in the AppHeader, the page in main; only main scrolls — `fillViewport`. */
import { AppHeader, AppShell, Button, Icon, PageContent, Sidebar, Typography } from "prime-ui-kit";

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
                  <span className={styles.logo}>
                    <Icon name="nav.layoutGrid" />
                  </span>
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
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>
              Обзор
              <AppHeader.Description>Октябрь · 37 сделок в работе</AppHeader.Description>
            </AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Actions>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новая сделка
            </Button.Root>
          </AppHeader.Actions>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Page>
            <PageContent.Body>
              <Typography variant="body-m" tone="secondary">
                Выручка за месяц — 4,8 млн ₽, на 12% больше, чем в сентябре.
              </Typography>
            </PageContent.Body>
          </PageContent.Page>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
