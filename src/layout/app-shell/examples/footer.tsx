/** A phone-wide app: the bar in the footer stays at the bottom while main scrolls under it, and leaves once the panel is 640px wide — `AppShell.Footer`. */
import { AppHeader, AppShell, BottomNav, Icon, PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  { label: "Главная", icon: "nav.home" },
  { label: "Счета", icon: "object.receipt" },
  { label: "Клиенты", icon: "object.users" },
  { label: "Ещё", icon: "action.more" },
] as const;

const INVOICES = [
  "Счёт № 1207 · 84 000 ₽",
  "Счёт № 1206 · 12 500 ₽",
  "Счёт № 1205 · 230 000 ₽",
  "Счёт № 1204 · 47 900 ₽",
  "Счёт № 1203 · 9 800 ₽",
  "Счёт № 1202 · 156 000 ₽",
  "Счёт № 1201 · 31 200 ₽",
  "Счёт № 1200 · 64 700 ₽",
];

export default function AppShellFooterExample() {
  return (
    <div className={styles.phone}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>Счета</AppHeader.Title>
          </AppHeader.Start>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Body>
              {INVOICES.map((invoice) => (
                <Typography key={invoice} variant="body-m">
                  {invoice}
                </Typography>
              ))}
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
