/** Root, nav, header and main in one component; main scrolls back to the top whenever the page changes — `AppShell.Template` with `scrollResetKey`. */
import { AppShell, Icon, PageContent, Sidebar, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PAGES = [
  { id: "mailings", label: "Рассылки", icon: "field.email", text: "3 активные кампании." },
  { id: "calendar", label: "Календарь", icon: "field.calendar", text: "5 событий на неделе." },
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
        <PageContent.Section>
          <PageContent.Header>
            {/* In a real app this is PageContent.Title (the page h1). */}
            <Typography as="h2" variant="heading-m">
              {page.label}
            </Typography>
            <PageContent.Description>{page.text}</PageContent.Description>
          </PageContent.Header>
        </PageContent.Section>
      </AppShell.Template>
    </div>
  );
}
