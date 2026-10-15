/** A document page in the flow: the path over the large title, its line of data and the page's actions, then the body with a section — `Page.Header`, `Page.Description`, `Page.Section`. */
import { Breadcrumb, Button, Card, Page, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PageStructureExample() {
  return (
    <div className={styles.main}>
      <Page.Root>
        <Page.Header>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#settings">Настройки</Breadcrumb.Item>
          </Breadcrumb.Root>
          <Page.Title>Уведомления</Page.Title>
          <Page.Description>Письма и сообщения, которые получает команда продаж.</Page.Description>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral">
              Сбросить
            </Button.Root>
            <Button.Root>Сохранить</Button.Root>
          </Page.Actions>
        </Page.Header>
        <Page.Body>
          <Page.Section label="Новые заказы" description="Сразу после оформления.">
            <Card.Root variant="panel">
              <Card.Body>
                <Typography variant="body-m" tone="secondary">
                  Письмо ответственному менеджеру и сводка в канал отдела продаж.
                </Typography>
              </Card.Body>
            </Card.Root>
          </Page.Section>
        </Page.Body>
      </Page.Root>
    </div>
  );
}
