/** On a phone the header leads with the menu button that opens the navigation by itself, the title and its line of data truncate and the page's action keeps its icon — `AppShell`, `offCanvas`. */
import { AppHeader, AppShell, Button, Icon, PageContent, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ORDERS = [
  "№ 4821 · ООО «Север» · 84 000 ₽",
  "№ 4820 · ИП Котов · 12 500 ₽",
  "№ 4819 · ООО «Вектор» · 230 000 ₽",
];

export default function AppHeaderNarrowExample() {
  return (
    <div className={`${styles.stage} ${styles.phone}`}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Nav>
          {/* `always`: this window is phone-wide on any screen; in an app keep the default `auto`. */}
          <Sidebar.Root offCanvas="always">
            <Sidebar.Content>
              <Sidebar.Item href="#overview">
                <Sidebar.ItemIcon>
                  <Icon name="nav.home" />
                </Sidebar.ItemIcon>
                Обзор
              </Sidebar.Item>
              <Sidebar.Item href="#orders" current>
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
              Заказы покупателей
              <AppHeader.Description>
                128 в работе · 6 ждут оплаты · 2 возврата
              </AppHeader.Description>
            </AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Actions>
            <Button.Root aria-label="Новый заказ">
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
            </Button.Root>
          </AppHeader.Actions>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Root as="section">
            <PageContent.Body>
              {ORDERS.map((order) => (
                <Typography key={order} variant="body-m">
                  {order}
                </Typography>
              ))}
            </PageContent.Body>
          </PageContent.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
