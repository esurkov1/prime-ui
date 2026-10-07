/** `placement="page"` is an edge-to-edge strip above a page, `placement="inset"` (default) a rounded block in the flow or in a card; below 36rem of its own width the actions move under the text. Use `page` for account-wide notices, `inset` for section messages. */
import { CreditCard, TriangleAlert } from "lucide-react";
import { Banner, Button, Card, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function TrialBanner({ placement }: { placement?: "inset" | "page" }) {
  return (
    <Banner.Root
      tone="warning"
      placement={placement}
      role="region"
      aria-label="Пробный период"
      onDismiss={() => {}}
    >
      <Banner.Content>
        <Banner.Icon as={TriangleAlert} aria-hidden />
        <Banner.Title>Пробный период закончится 12 октября</Banner.Title>
        <Banner.Description>
          Выберите тариф, чтобы сохранить отчёты и настройки команды. Данные останутся доступны ещё
          30 дней.
        </Banner.Description>
        <Banner.Actions>
          <Button.Root variant="outline" tone="neutral">
            Сравнить тарифы
          </Button.Root>
          <Button.Root>Выбрать тариф</Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}

export default function BannerPlacementExample() {
  return (
    <div className={styles.sections}>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          <Typography.Root as="span" variant="code" tone="muted">
            placement="page"
          </Typography.Root>{" "}
          — над страницей
        </Typography.Root>
        <div className={styles.pageFrame}>
          <TrialBanner placement="page" />
          <div className={styles.pageBody}>
            <Typography.Root as="h3" variant="heading-s">
              Отчёты
            </Typography.Root>
          </div>
        </div>
      </div>

      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          <Typography.Root as="span" variant="code" tone="muted">
            placement="inset"
          </Typography.Root>{" "}
          — внутри карточки
        </Typography.Root>
        <Card.Root variant="panel">
          <Card.SectionHeader>
            <Card.SectionTitle>Оплата</Card.SectionTitle>
          </Card.SectionHeader>
          <Card.Body>
            <Banner.Root tone="danger">
              <Banner.Content>
                <Banner.Icon as={CreditCard} aria-hidden />
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

      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          320px — действия под текстом
        </Typography.Root>
        <div className={styles.narrow}>
          <TrialBanner />
        </div>
      </div>
    </div>
  );
}
