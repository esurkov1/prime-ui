/** A shell without navigation whose main column is centred and capped for long reads — `contentWidth`. */
import { AppShell, PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppShellContainedExample() {
  return (
    <div className={styles.stage}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Main contentWidth="contained">
          <PageContent.Root maxWidth="readable">
            <PageContent.Header>
              {/* In a real app this is PageContent.Title (the page h1). */}
              <Typography.Root as="h2" variant="heading-m">
                Как подключить оплату
              </Typography.Root>
              <PageContent.Description>Обновлено 1 октября 2026 года.</PageContent.Description>
            </PageContent.Header>
            <PageContent.Body>
              <Typography.Root as="p" variant="body-l">
                Откройте раздел «Настройки», выберите «Оплата» и укажите реквизиты. После проверки
                банк пришлёт подтверждение, и приём платежей включится автоматически.
              </Typography.Root>
            </PageContent.Body>
          </PageContent.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
