/** A card region that cross-fades between loading, data, empty and error and glides to the new height — `state`. */
import {
  Button,
  Card,
  Crossfade,
  DescriptionList,
  EmptyPage,
  Icon,
  SegmentedControl,
  Skeleton,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Status = "loading" | "ready" | "empty" | "error";

const PAYMENTS = [
  { id: "p1", payer: "ООО «Гранит»", amount: "94 750 ₽" },
  { id: "p2", payer: "ИП Орлов Д. С.", amount: "18 000 ₽" },
  { id: "p3", payer: "АО «Альфа Медиа»", amount: "380 000 ₽" },
];

export default function CrossfadeOverviewExample() {
  const [status, setStatus] = React.useState<Status>("ready");

  return (
    <div className={styles.stack}>
      <SegmentedControl.Root
        value={status}
        onValueChange={(value) => setStatus(value as Status)}
        aria-label="Состояние блока"
      >
        <SegmentedControl.Item value="loading">Загрузка</SegmentedControl.Item>
        <SegmentedControl.Item value="ready">Данные</SegmentedControl.Item>
        <SegmentedControl.Item value="empty">Пусто</SegmentedControl.Item>
        <SegmentedControl.Item value="error">Ошибка</SegmentedControl.Item>
      </SegmentedControl.Root>

      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title as="h3">Поступления за сегодня</Card.Title>
        </Card.Header>
        <Card.Body>
          <Crossfade state={status} aria-busy={status === "loading"}>
            {/* The placeholder is the same list with bars for the text: the swap keeps the height. */}
            {status === "loading" ? (
              <DescriptionList.Root>
                {PAYMENTS.map((payment) => (
                  <DescriptionList.Item
                    key={payment.id}
                    label={<Skeleton className={styles.payerBar} />}
                  >
                    <Skeleton className={styles.amountBar} />
                  </DescriptionList.Item>
                ))}
              </DescriptionList.Root>
            ) : null}
            {status === "ready" ? (
              <DescriptionList.Root>
                {PAYMENTS.map((payment) => (
                  <DescriptionList.Item key={payment.id} label={payment.payer}>
                    {payment.amount}
                  </DescriptionList.Item>
                ))}
              </DescriptionList.Root>
            ) : null}
            {status === "empty" ? (
              <EmptyPage.Root size="s" aria-labelledby="payments-empty">
                <EmptyPage.Icon>
                  <Icon name="status.success" />
                </EmptyPage.Icon>
                <EmptyPage.Title as="h4" id="payments-empty">
                  Поступлений нет
                </EmptyPage.Title>
                <EmptyPage.Description>Новые платежи появятся после выписки.</EmptyPage.Description>
              </EmptyPage.Root>
            ) : null}
            {status === "error" ? (
              <EmptyPage.Root size="s" role="alert" aria-labelledby="payments-error">
                <EmptyPage.Icon tone="danger">
                  <Icon name="status.danger" />
                </EmptyPage.Icon>
                <EmptyPage.Title as="h4" id="payments-error">
                  Выписка не загрузилась
                </EmptyPage.Title>
                <EmptyPage.Description>Банк не ответил на запрос.</EmptyPage.Description>
                <EmptyPage.Actions>
                  <Button.Root variant="soft" tone="neutral" onClick={() => setStatus("ready")}>
                    Повторить
                  </Button.Root>
                </EmptyPage.Actions>
              </EmptyPage.Root>
            ) : null}
          </Crossfade>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
