// A payments page built without the button copy rule: the input of the «icon is the verb» eval.
// Every icon button repeats its icon's verb in its text: «+ Добавить оплату», «⬇ Скачать реестр»,
// «↻ Обновить», and a trash «Удалить» in every row.
import { Button, Card, Icon, Page, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./payments-page.module.css";

type Payment = { id: string; client: string; amount: number; date: string };

const PAYMENTS: Payment[] = [
  { id: "p-1041", client: "ООО «Север»", amount: 48000, date: "12 октября" },
  { id: "p-1042", client: "ИП Соколова", amount: 12500, date: "14 октября" },
  { id: "p-1043", client: "АО «Вектор»", amount: 230000, date: "15 октября" },
];

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" });

export function PaymentsPage() {
  const [payments, setPayments] = React.useState(PAYMENTS);

  return (
    <Page.Root>
      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Оплаты</Page.Title>
        </Page.Heading>
        <Page.Actions>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.refresh" />
            </Button.Icon>
            Обновить
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Скачать реестр
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Добавить оплату
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
      <Page.Body>
        <Card.Root>
          <Card.Body>
            {payments.map((payment) => (
              <div key={payment.id} className={styles.row}>
                <Typography variant="body-m">{payment.client}</Typography>
                <Typography variant="body-m">{money.format(payment.amount)}</Typography>
                <Typography variant="body-s" tone="secondary">
                  {payment.date}
                </Typography>
                <Button.Root
                  variant="ghost"
                  tone="danger"
                  onClick={() =>
                    setPayments((current) => current.filter((item) => item.id !== payment.id))
                  }
                >
                  <Button.Icon>
                    <Icon name="action.delete" />
                  </Button.Icon>
                  Удалить
                </Button.Root>
              </div>
            ))}
          </Card.Body>
        </Card.Root>
      </Page.Body>
    </Page.Root>
  );
}
