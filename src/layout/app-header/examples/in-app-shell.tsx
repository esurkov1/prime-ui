/** The header in the app frame: one row with the Sidebar brand across the two planes, sticky over main — `AppShell`, `Sidebar.Brand`. */
import { AppHeader, AppShell, Icon, PageContent, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ORDERS = [
  "№ 4821 · ООО «Север» · 84 000 ₽",
  "№ 4820 · ИП Котов · 12 500 ₽",
  "№ 4819 · ООО «Вектор» · 230 000 ₽",
  "№ 4818 · АО «Меридиан» · 47 900 ₽",
  "№ 4817 · ООО «Полюс» · 9 800 ₽",
  "№ 4816 · ИП Белова · 156 000 ₽",
];

export default function AppHeaderInAppShellExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root offCanvas="never">
            <Sidebar.Header>
              <Sidebar.Brand href="#home" description="Отдел продаж">
                <Sidebar.BrandLogo>
                  <span className={styles.logo}>
                    <Icon name="nav.layoutGrid" />
                  </span>
                </Sidebar.BrandLogo>
                Acme CRM
              </Sidebar.Brand>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <Icon name="nav.home" />
                </Sidebar.ItemIcon>
                Обзор
              </Sidebar.Item>
              <Sidebar.Item current>
                <Sidebar.ItemIcon>
                  <Icon name="object.package" />
                </Sidebar.ItemIcon>
                Заказы
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>
              Заказы
              <AppHeader.Description>128 в работе</AppHeader.Description>
            </AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Search>Поиск</AppHeader.Search>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Body>
              {ORDERS.map((order) => (
                <Typography key={order} variant="body-m">
                  {order}
                </Typography>
              ))}
            </PageContent.Body>
          </PageContent.Section>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
