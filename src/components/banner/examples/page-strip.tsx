/** An edge-to-edge strip above a page and a rounded block inside a card — `placement`. */
import { Banner, Button, Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BannerPageStripExample() {
  return (
    <div className={styles.sections}>
      {/* In an app the strip stands first in the page, edge to edge above its padded content. */}
      <Banner.Root
        tone="warning"
        placement="page"
        role="region"
        aria-label="Пробный период"
        onDismiss={() => undefined}
      >
        <Banner.Content>
          <Banner.Icon>
            <Icon name="status.warning" />
          </Banner.Icon>
          <Banner.Title>Пробный период закончится 12 октября</Banner.Title>
        </Banner.Content>
      </Banner.Root>
      <div className={styles.pageBody}>
        <Card.Root variant="panel">
          <Card.Header>
            <Card.Title>Оплата</Card.Title>
          </Card.Header>
          <Card.Body>
            <Banner.Root tone="danger">
              <Banner.Content>
                <Banner.Icon>
                  <Icon name="status.danger" />
                </Banner.Icon>
                <Banner.Title>Не удалось списать оплату</Banner.Title>
                <Banner.Description>
                  Карта •••• 4242 отклонена банком. Обновите способ оплаты до 15 октября.
                </Banner.Description>
                <Banner.Actions>
                  <Button.Root tone="danger">Обновить карту</Button.Root>
                </Banner.Actions>
              </Banner.Content>
            </Banner.Root>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
