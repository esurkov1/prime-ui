/** A nested page: a back button, a separator and the path instead of a title, actions on the record at the end — `AppHeader.Separator`, `AppHeader.Actions`. */
import { AppHeader, Breadcrumb, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppHeaderBreadcrumbsExample() {
  return (
    <div className={styles.window}>
      <AppHeader.Root>
        <AppHeader.Start>
          <Button.Root variant="soft" tone="neutral" aria-label="Назад к клиентам">
            <Button.Icon>
              <Icon name="nav.chevronLeft" />
            </Button.Icon>
          </Button.Root>
          <AppHeader.Separator />
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
            <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
            <Breadcrumb.Item current>ООО «Север»</Breadcrumb.Item>
          </Breadcrumb.Root>
        </AppHeader.Start>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral">
            Экспорт
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
