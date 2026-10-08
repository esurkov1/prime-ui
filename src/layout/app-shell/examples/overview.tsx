/** The app frame: Sidebar in the nav column, breadcrumbs in the AppHeader, the page in main; only main scrolls — `fillViewport`. */
import {
  AppHeader,
  AppShell,
  Breadcrumb,
  Button,
  Icon,
  PageContent,
  Sidebar,
  Typography,
} from "prime-ui-kit";

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
            <Breadcrumb.Root>
              <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
              <Breadcrumb.Item current>Обзор</Breadcrumb.Item>
            </Breadcrumb.Root>
          </AppHeader.Start>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Header>
              {/* In a real app this is PageContent.Title (the page h1). */}
              <Typography as="h2" variant="heading-m">
                Обзор
              </Typography>
              <PageContent.Actions>
                <Button.Root>
                  <Button.Icon>
                    <Icon name="action.add" />
                  </Button.Icon>
                  Новая сделка
                </Button.Root>
              </PageContent.Actions>
            </PageContent.Header>
            <PageContent.Body>
              <Typography variant="body-m" tone="secondary">
                Выручка за месяц — 4,8 млн ₽, 37 сделок в работе.
              </Typography>
            </PageContent.Body>
          </PageContent.Section>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
