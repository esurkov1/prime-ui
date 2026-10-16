/** A document page whose large title scrolls away under the top bar: the bar holds the path and repeats the title after it once the title is out of view — `collapse`, `Page.Header`. */
import { AppShell, Breadcrumb, Button, Card, Icon, Page, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SECTIONS = [
  {
    id: "terms",
    title: "Сроки",
    text: "Клиент может вернуть заказ в течение 14 дней после получения. Срок считается от даты в акте приёмки.",
  },
  {
    id: "condition",
    title: "Состояние товара",
    text: "Товар принимается в заводской упаковке, без следов использования, с ярлыками и полным комплектом.",
  },
  {
    id: "refund",
    title: "Возврат денег",
    text: "Деньги возвращаются тем же способом, которым был оплачен заказ, в течение 10 рабочих дней после проверки.",
  },
  {
    id: "delivery",
    title: "Доставка при возврате",
    text: "Если товар с браком, доставку оплачивает магазин. В остальных случаях — клиент по тарифу службы доставки.",
  },
  {
    id: "exceptions",
    title: "Исключения",
    text: "Не возвращаются товары, изготовленные по индивидуальному заказу, и цифровые лицензии после активации.",
  },
];

export default function PageCollapseExample() {
  return (
    <div className={`${styles.window} ${styles.tall}`}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Main>
          <Page.Root maxWidth="readable">
            <Page.TopBar collapse>
              <Page.Heading>
                <Breadcrumb.Root>
                  <Breadcrumb.Item href="#documents">Документы</Breadcrumb.Item>
                </Breadcrumb.Root>
              </Page.Heading>
            </Page.TopBar>
            <Page.Header>
              <Page.Heading>
                <Page.Title>Политика возвратов</Page.Title>
                <Page.Description>
                  Действует с 1 сентября для всех заказов магазина.
                </Page.Description>
              </Page.Heading>
              <Page.Actions>
                <Button.Root variant="soft" tone="neutral">
                  <Button.Icon>
                    <Icon name="action.download" />
                  </Button.Icon>
                  Скачать PDF
                </Button.Root>
              </Page.Actions>
            </Page.Header>
            <Page.Body>
              {SECTIONS.map((section) => (
                <Card.Root key={section.id} variant="panel">
                  <Card.Header>
                    <Card.Title as="h2">{section.title}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Typography variant="body-m" tone="secondary">
                      {section.text}
                    </Typography>
                  </Card.Body>
                </Card.Root>
              ))}
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
