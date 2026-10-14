/** A nested record: the path up, a separator and the record as the page title, the record's buttons at the end — `AppHeader.Separator`, `AppHeader.Actions`. */
import { AppHeader, Breadcrumb, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppHeaderBreadcrumbsExample() {
  return (
    <div className={styles.window}>
      <AppHeader.Root>
        <AppHeader.Start>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
            <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
          </Breadcrumb.Root>
          <AppHeader.Separator />
          <AppHeader.Title>
            ООО «Север»
            <AppHeader.Description>Клиент с 2021 года · 4 сделки</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.send" />
            </Button.Icon>
            Написать
          </Button.Root>
          <Button.Root variant="soft" tone="neutral" aria-label="Ещё действия">
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </AppHeader.Actions>
      </AppHeader.Root>
    </div>
  );
}
