/** On a phone the top bar leads with the menu button that opens the navigation by itself, the title and its line of data truncate and the secondary actions fold into «⋯» — `offCanvas`, `Page.Actions`. */
import { AppShell, Button, Icon, Page, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ORDERS = [
  "№ 4821 · ООО «Север» · 84 000 ₽",
  "№ 4820 · ИП Котов · 12 500 ₽",
  "№ 4819 · ООО «Вектор» · 230 000 ₽",
];

export default function PageNarrowExample() {
  return (
    <div className={`${styles.window} ${styles.phone}`}>
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
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Header>
                <Page.Title>Заказы покупателей</Page.Title>
                <Page.Description>128 в работе · 6 ждут оплаты · 2 возврата</Page.Description>
                <Page.Actions>
                  <Button.Root variant="soft" tone="neutral">
                    <Button.Icon>
                      <Icon name="action.download" />
                    </Button.Icon>
                    Экспорт
                  </Button.Root>
                  <Button.Root variant="soft" tone="neutral">
                    <Button.Icon>
                      <Icon name="action.refresh" />
                    </Button.Icon>
                    Обновить
                  </Button.Root>
                  <Button.Root aria-label="Новый заказ">
                    <Button.Icon>
                      <Icon name="action.add" />
                    </Button.Icon>
                  </Button.Root>
                </Page.Actions>
              </Page.Header>
            </Page.TopBar>
            <Page.Body>
              {ORDERS.map((order) => (
                <Typography key={order} variant="body-m">
                  {order}
                </Typography>
              ))}
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
