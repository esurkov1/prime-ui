/** A page in the main column: title, description and page actions, then the body blocks — `PageContent.Actions`. */
import { Button, Card, PageContent, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageContentOverviewExample() {
  return (
    <div className={styles.main}>
      <PageContent.Section aria-labelledby="settings-heading">
        <PageContent.Header>
          <PageContent.Title id="settings-heading">Настройки</PageContent.Title>
          <PageContent.Description>
            Профиль рабочего пространства и уведомления.
          </PageContent.Description>
          <PageContent.Actions>
            <Button.Root variant="soft" tone="neutral">
              Экспорт
            </Button.Root>
            <Button.Root>Сохранить</Button.Root>
          </PageContent.Actions>
        </PageContent.Header>
        <PageContent.Body>
          <Card.Root variant="panel">
            <Typography variant="body-m" tone="secondary">
              Компания «Прайм Софт», часовой пояс Москва (UTC+3), валюта — рубль.
            </Typography>
          </Card.Root>
          <Card.Root variant="panel">
            <Typography variant="body-m" tone="secondary">
              Письма о новых заказах и сводка по понедельникам включены.
            </Typography>
          </Card.Root>
        </PageContent.Body>
      </PageContent.Section>
    </div>
  );
}
