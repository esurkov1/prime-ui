/** Root, nav, main and footer in one component; main scrolls back to the top whenever the page changes — `AppShell.Template`, `scrollResetKey`. */
import { AppShell, Icon, Page, Sidebar, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PAGES = [
  {
    id: "mailings",
    label: "Рассылки",
    icon: "field.email",
    text: "3 активные кампании",
    note: "Последняя рассылка ушла вчера в 10:00, её открыли 42% получателей.",
  },
  {
    id: "calendar",
    label: "Календарь",
    icon: "field.calendar",
    text: "5 событий на неделе",
    note: "Ближайшее — созвон с ООО «Север» сегодня в 15:00.",
  },
] as const;

export default function AppShellTemplateExample() {
  // In a router app pass the pathname: `scrollResetKey={useLocation().pathname}`.
  const [pageId, setPageId] = React.useState<(typeof PAGES)[number]["id"]>("mailings");
  const page = PAGES.find((item) => item.id === pageId) ?? PAGES[0];

  return (
    <div className={styles.stage}>
      <AppShell.Template
        fillViewport
        className={styles.shell}
        scrollResetKey={pageId}
        nav={
          <Sidebar.Root offCanvas="never">
            <Sidebar.Content>
              {PAGES.map((item) => (
                <Sidebar.Item
                  key={item.id}
                  current={item.id === pageId}
                  onClick={() => setPageId(item.id)}
                >
                  <Sidebar.ItemIcon>
                    <Icon name={item.icon} />
                  </Sidebar.ItemIcon>
                  {item.label}
                </Sidebar.Item>
              ))}
            </Sidebar.Content>
          </Sidebar.Root>
        }
      >
        <Page.Root>
          <Page.TopBar>
            <Page.Heading>
              <Page.Title>{page.label}</Page.Title>
              <Page.Description>{page.text}</Page.Description>
            </Page.Heading>
          </Page.TopBar>
          <Page.Body>
            <Typography variant="body-m" tone="secondary">
              {page.note}
            </Typography>
          </Page.Body>
        </Page.Root>
      </AppShell.Template>
    </div>
  );
}
