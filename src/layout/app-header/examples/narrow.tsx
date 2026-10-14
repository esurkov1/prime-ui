/** On a phone: the menu button opens the navigation, the title and its line of data truncate and the page's action keeps its icon — `AppHeader.MenuButton`, `show`. */
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
            Заказы покупателей
            <AppHeader.Description>128 в работе · 6 ждут оплаты · 2 возврата</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Actions>
          <Button.Root aria-label="Новый заказ">
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
          </Button.Root>
        </AppHeader.Actions>
      </AppHeader.Root>
    </div>
  );
}
