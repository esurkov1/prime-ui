/** The app's floating main action: in the corner beside the Sidebar rail on a wide screen, above the floating BottomNav on a phone, under the Drawer it opens — `AppShell.Fab`. */
import { AppShell, BottomNav, Drawer, Icon, Page, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { label: "Сделки", icon: "object.funnel" },
  { label: "Клиенты", icon: "object.users" },
  { label: "Задачи", icon: "object.tasks" },
] as const;

const DEALS = [
  "ООО «Север» · 480 000 ₽ · переговоры",
  "ИП Смирнова · 96 000 ₽ · счёт выставлен",
  "АО «Маяк» · 1 250 000 ₽ · коммерческое предложение",
  "ООО «Вектор» · 312 000 ₽ · договор на подписи",
  "ООО «Гранит» · 74 500 ₽ · первый звонок",
  "ЗАО «Ладога» · 640 000 ₽ · переговоры",
];

export default function AppShellFabExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root className={styles.shell}>
        <AppShell.Nav>
          <Sidebar.Root defaultMode="compact">
            <Sidebar.Content>
              {SECTIONS.map((item, index) => (
                <Sidebar.Item key={item.label} current={index === 0}>
                  <Sidebar.ItemIcon>
                    <Icon name={item.icon} />
                  </Sidebar.ItemIcon>
                  {item.label}
                </Sidebar.Item>
              ))}
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Heading>
                <Page.Title>Сделки</Page.Title>
                <Page.Description>6 в работе · 2,85 млн ₽</Page.Description>
              </Page.Heading>
            </Page.TopBar>
            <Page.Body>
              {DEALS.map((deal) => (
                <Typography key={deal} variant="body-m">
                  {deal}
                </Typography>
              ))}
            </Page.Body>
          </Page.Root>
          {/* Rendered anywhere in the shell, it stands in the corner of its dock. */}
          <Drawer.Root>
            <Drawer.Trigger>
              <AppShell.Fab aria-label="Ассистент">
                <Icon name="object.message" />
              </AppShell.Fab>
            </Drawer.Trigger>
            <Drawer.Content size="s">
              <Drawer.Header>
                <Drawer.Title>Ассистент</Drawer.Title>
                <Drawer.Description>Ответы по сделкам и клиентам</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Typography variant="body-m" tone="secondary">
                  Спросите, какие сделки зависли на переговорах дольше недели.
                </Typography>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </AppShell.Main>
        <AppShell.Footer>
          <BottomNav.Root floating>
            {SECTIONS.map((item, index) => (
              <BottomNav.Item key={item.label} current={index === 0}>
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
