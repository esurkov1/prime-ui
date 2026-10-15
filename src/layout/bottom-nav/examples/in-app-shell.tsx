/** The app frame on a phone: the page with its top bar and the bar in the footer, which gives way to the Sidebar rail once one is on screen — `AppShell.Footer`. */
import { AppShell, BottomNav, Button, Icon, Page, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { label: "Главная", icon: "nav.home" },
  { label: "Заказы", icon: "object.package" },
  { label: "Клиенты", icon: "object.users" },
  { label: "Ещё", icon: "action.more" },
] as const;

const ORDERS = ["№ 4821 · ООО «Север»", "№ 4820 · ИП Котов", "№ 4819 · ООО «Вектор»"];

export default function BottomNavInAppShellExample() {
  return (
    <div className={styles.phone}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Heading>
                <Page.Title>Заказы</Page.Title>
              </Page.Heading>
            </Page.TopBar>
            <Page.Body>
              {ORDERS.map((order) => (
                <Typography key={order} variant="body-m">
                  {order}
                </Typography>
              ))}
              <Button.Root variant="soft" tone="neutral">
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                Новый заказ
              </Button.Root>
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
        <AppShell.Footer>
          <BottomNav.Root>
            {SECTIONS.map((item, index) => (
              <BottomNav.Item key={item.label} current={index === 1}>
                <BottomNav.ItemIcon>
                  <Icon name={item.icon} />
                </BottomNav.ItemIcon>
                {item.label}
              </BottomNav.Item>
            ))}
          </BottomNav.Root>
        </AppShell.Footer>
      </AppShell.Root>
    </div>
  );
}
