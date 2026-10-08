/** The top bar of a screen: where you are, global search, notifications and the primary action — `AppHeader.Title`, `AppHeader.Search`, `AppHeader.Actions`. */
import { AppHeader, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppHeaderOverviewExample() {
  return (
    <div className={styles.window}>
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            <AppHeader.Icon>
              <Icon name="nav.dashboard" />
            </AppHeader.Icon>
            Обзор
            <AppHeader.Description>Отдел продаж · октябрь</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Search>Поиск заказов и клиентов</AppHeader.Search>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral" aria-label="Уведомления">
            <Button.Icon>
              <Icon name="object.bell" />
            </Button.Icon>
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новый заказ
          </Button.Root>
        </AppHeader.Actions>
      </AppHeader.Root>
    </div>
  );
}
