/** A work page in an app window: the top bar with the title, its line of data and the page's buttons, the body under it — `Page.TopBar`, `Page.Heading`, `Page.Actions`. */
import { AppShell, Button, Card, Icon, Page, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ORDERS = [
  { id: "№ 4821", client: "ООО «Север»", sum: "84 000 ₽" },
  { id: "№ 4820", client: "ИП Котов", sum: "12 500 ₽" },
  { id: "№ 4819", client: "ООО «Вектор»", sum: "230 000 ₽" },
  { id: "№ 4818", client: "АО «Техностиль»", sum: "47 900 ₽" },
];

export default function PageOverviewExample() {
  return (
    <div className={styles.window}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Heading>
                <Page.Title>Заказы</Page.Title>
                <Page.Description>128 в работе · 6 ждут оплаты</Page.Description>
              </Page.Heading>
              <Page.Actions>
                <Button.Root variant="soft" tone="neutral">
                  <Button.Icon>
                    <Icon name="action.download" />
                  </Button.Icon>
                  Экспорт
                </Button.Root>
                <Button.Root aria-label="Новый заказ">
                  <Button.Icon>
                    <Icon name="action.add" />
                  </Button.Icon>
                  Заказ
                </Button.Root>
              </Page.Actions>
            </Page.TopBar>
            <Page.Body>
              <Card.Root>
                <Card.List>
                  {ORDERS.map((order) => (
                    <Card.ListItem key={order.id}>
                      <Typography as="span" variant="body-m">
                        {order.id} · {order.client} · {order.sum}
                      </Typography>
                    </Card.ListItem>
                  ))}
                </Card.List>
              </Card.Root>
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
