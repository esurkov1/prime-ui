/** The app frame on a phone: the AppHeader, the page and the bar in the footer, which leaves once the panel is 640px wide — `AppShell.Footer`. */
import {
  AppHeader,
  AppShell,
  BottomNav,
  Button,
  Icon,
  PageContent,
  Typography,
} from "prime-ui-kit";

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
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>Заказы</AppHeader.Title>
          </AppHeader.Start>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Body>
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
            </PageContent.Body>
          </PageContent.Section>
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
