/** The page's header: the page title with its icon and a line of data under it, the page's own buttons at the end — `AppHeader.Title`, `AppHeader.Description`, `AppHeader.Actions`. */
import { AppHeader, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppHeaderOverviewExample() {
  return (
    <div className={styles.window}>
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            <AppHeader.Icon>
              <Icon name="object.package" />
            </AppHeader.Icon>
            Заказы
            <AppHeader.Description>128 в работе · 6 ждут оплаты</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral" aria-label="Экспорт в CSV">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
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
