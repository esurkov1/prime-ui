/** Root, nav, header and main in one component; inside a router main scrolls to the top on every route change — `AppShell.Template`. */
import { AppShell, Icon, PageContent, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppShellTemplateExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Template
        fillViewport
        className={styles.shell}
        nav={
          <Sidebar.Root offCanvas="never">
            <Sidebar.Content>
              <Sidebar.Item current>
                <Sidebar.ItemIcon>
                  <Icon name="field.email" />
                </Sidebar.ItemIcon>
                Рассылки
              </Sidebar.Item>
              <Sidebar.Item>
                <Sidebar.ItemIcon>
                  <Icon name="field.calendar" />
                </Sidebar.ItemIcon>
                Календарь
              </Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>
        }
      >
        <PageContent.Section>
          <PageContent.Header>
            {/* In a real app this is PageContent.Title (the page h1). */}
            <Typography as="h2" variant="heading-m">
              Рассылки
            </Typography>
            <PageContent.Description>
              3 активные кампании, следующая — в пятницу.
            </PageContent.Description>
          </PageContent.Header>
        </PageContent.Section>
      </AppShell.Template>
    </div>
  );
}
