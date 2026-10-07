/** Full app frame: Sidebar in AppShell.Nav on the canvas, breadcrumbs in AppShell.Header, a page with an action and a card in AppShell.Main; with `fillViewport` only main scrolls. Use as the root layout of an app. */
import { FileText, LayoutDashboard, Plus, Settings, Users } from "lucide-react";
import { AppShell, Breadcrumb, Button, Card, PageContent, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppShellWithSidebarExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root responsive={false}>
            <Sidebar.Header>
              <Typography.Root variant="title-s">Acme CRM</Typography.Root>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Item current>
                <Sidebar.ItemIcon>
                  <LayoutDashboard />
                </Sidebar.ItemIcon>
                Обзор
              </Sidebar.Item>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <Users />
                </Sidebar.ItemIcon>
                Клиенты
              </Sidebar.Item>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <FileText />
                </Sidebar.ItemIcon>
                Отчёты
              </Sidebar.Item>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <Settings />
                </Sidebar.ItemIcon>
                Настройки
              </Sidebar.Item>
              <Sidebar.Toggle />
            </Sidebar.Footer>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Header>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
            <Breadcrumb.Item current>Обзор</Breadcrumb.Item>
          </Breadcrumb.Root>
        </AppShell.Header>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Header>
              {/* In a real app this is PageContent.Title (the page h1). */}
              <Typography.Root as="h2" variant="heading-m">
                Обзор
              </Typography.Root>
              <PageContent.Actions>
                <Button.Root>
                  <Button.Icon>
                    <Plus />
                  </Button.Icon>
                  Новая сделка
                </Button.Root>
              </PageContent.Actions>
            </PageContent.Header>
            <PageContent.Body>
              <Card.Root variant="metric">
                <Card.Label>Выручка за месяц</Card.Label>
                <Card.Value>4,8 млн ₽</Card.Value>
              </Card.Root>
            </PageContent.Body>
          </PageContent.Section>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
