/** The buttons of an invoices page on a tablet-wide column: the line runs short, so the secondary buttons show only their icons with the label as the name and the tooltip, the primary keeps its label — `Page.Actions`, `Button.Icon`. */
import { Button, Icon, Page } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageActionsCollapseExample() {
  return (
    <div className={styles.tablet}>
      <Page.Root>
        <Page.TopBar sticky={false}>
          <Page.Heading>
            <Page.Title>Счета на оплату</Page.Title>
            <Page.Description>42 счёта · 1,8 млн ₽ ждут оплаты</Page.Description>
          </Page.Heading>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
              Экспорт
            </Button.Root>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.upload" />
              </Button.Icon>
              Импорт
            </Button.Root>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.forward" />
              </Button.Icon>
              Отправить клиентам
            </Button.Root>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Счёт
            </Button.Root>
          </Page.Actions>
        </Page.TopBar>
      </Page.Root>
    </div>
  );
}
