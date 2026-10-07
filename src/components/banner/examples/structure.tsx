/** Optional parts: a one-line title, a title with a description, and actions where the close button joins the row — `Banner.Description`, `Banner.Actions`, `onDismiss`. */
import { Banner, Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const noop = () => undefined;

export default function BannerStructureExample() {
  return (
    <div className={styles.stack}>
      <Banner.Root tone="success">
        <Banner.Content>
          <Banner.Icon>
            <Icon name="status.success" />
          </Banner.Icon>
          <Banner.Title>Оплата прошла</Banner.Title>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root tone="warning" onDismiss={noop}>
        <Banner.Content>
          <Banner.Icon>
            <Icon name="status.warning" />
          </Banner.Icon>
          <Banner.Title>Подтвердите email</Banner.Title>
          <Banner.Description>Без него уведомления о заказах не приходят.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root tone="warning" onDismiss={noop}>
        <Banner.Content>
          <Banner.Icon>
            <Icon name="status.warning" />
          </Banner.Icon>
          <Banner.Title>Пробный период закончится 12 октября</Banner.Title>
          <Banner.Description>Выберите тариф, чтобы сохранить отчёты команды.</Banner.Description>
          <Banner.Actions>
            <Button.Root variant="outline" tone="neutral">
              Сравнить
            </Button.Root>
            <Button.Root>Выбрать тариф</Button.Root>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>
    </div>
  );
}
