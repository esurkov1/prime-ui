/** On a phone: the menu button opens the navigation, the description goes and the search folds into an icon — `AppHeader.MenuButton`, `show`. */
import { AppHeader, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AppHeaderNarrowExample() {
  return (
    <div className={`${styles.window} ${styles.phone}`}>
      <AppHeader.Root>
        <AppHeader.Start>
          {/* `always`: this frame is phone-wide on any screen; in an app keep the default `narrow`. */}
          <AppHeader.MenuButton show="always" aria-expanded={false} />
          <AppHeader.Title>
            Заказы
            <AppHeader.Description>128 в работе</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Search>Поиск заказов</AppHeader.Search>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral" aria-label="Новый заказ">
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
          </Button.Root>
        </AppHeader.Actions>
      </AppHeader.Root>
    </div>
  );
}
