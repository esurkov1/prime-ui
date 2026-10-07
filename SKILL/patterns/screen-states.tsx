/** Screen states: a page-level error in a Banner with a retry, a region loading with a Spinner and table skeleton, the table error in place and a first-run EmptyPage; regions cross-fade between states. */
import {
  Banner,
  Button,
  Card,
  Crossfade,
  DataTable,
  type DataTableColumn,
  EmptyPage,
  Icon,
  PageContent,
  Spinner,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen-states.module.css";

type Status = "error" | "loading" | "ready";
type Payment = { id: string; payer: string; purpose: string; amount: number };

const PAYMENTS: Payment[] = [
  { id: "b1", payer: "ООО «Гранит»", purpose: "Оплата по сч. 2026-0414", amount: 94_750 },
  { id: "b2", payer: "ИП Орлов Д. С.", purpose: "Предоплата за обучение", amount: 18_000 },
  { id: "b3", payer: "АО «Альфа Медиа»", purpose: "Без указания счёта", amount: 380_000 },
];

const ACCOUNTS = [
  { name: "Т-Банк, расчётный", balance: "₽ 4 812 300" },
  { name: "Сбербанк, расчётный", balance: "₽ 1 207 950" },
];

const MONEY = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Payment>[] = [
  { id: "payer", header: "Плательщик", accessor: "payer" },
  { id: "purpose", header: "Назначение", accessor: "purpose" },
  {
    id: "amount",
    header: "Сумма",
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.amount),
  },
];

export default function ScreenStatesPattern() {
  const { notify } = useNotifications();
  const [status, setStatus] = React.useState<Status>("error");

  const retry = () => {
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("ready");
      notify({
        tone: "success",
        title: "Выписка получена",
        description: "3 платежа ждут разнесения",
      });
    }, 1500);
  };

  return (
    <PageContent.Section aria-labelledby="reconcile-title">
      <PageContent.Header>
        <PageContent.Title id="reconcile-title">Сверка с банком</PageContent.Title>
        <PageContent.Description>
          Поступления из выписок, которые нужно связать со счетами.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        {status === "error" ? (
          <Banner.Root tone="danger">
            <Banner.Content>
              <Banner.Icon>
                <Icon name="status.danger" />
              </Banner.Icon>
              <Banner.Title>Выписка за 7 октября не получена</Banner.Title>
              <Banner.Description>
                Т-Банк не ответил на запрос. Остатки показаны на 6 октября.
              </Banner.Description>
              <Banner.Actions>
                <Button.Root variant="outline" tone="neutral" onClick={retry}>
                  Повторить
                </Button.Root>
              </Banner.Actions>
            </Banner.Content>
          </Banner.Root>
        ) : null}

        <div className={styles.panels}>
          <Card.Root variant="panel" aria-busy={status === "loading"}>
            <Card.Header>
              <Card.Title as="h2">Остатки</Card.Title>
              <Typography as="span" variant="caption" tone="muted">
                {status === "ready" ? "на 7 октября" : "на 6 октября"}
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Loading ↔ data cross-fade in place; the table below swaps its body the same way. */}
              <Crossfade state={status === "loading" ? "loading" : "ready"}>
                {status === "loading" ? (
                  <div className={styles.loading}>
                    <Spinner aria-hidden="true" />
                  </div>
                ) : (
                  <ul className={styles.accounts}>
                    {ACCOUNTS.map((account) => (
                      <li key={account.name} className={styles.account}>
                        <Typography as="span" variant="body-m" tone="secondary">
                          {account.name}
                        </Typography>
                        <Typography as="span" variant="title-m" className={styles.amount}>
                          {account.balance}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </Crossfade>
            </Card.Body>
          </Card.Root>

          <Card.Root variant="panel">
            <Card.Header>
              <Card.Title as="h2">Правила разнесения</Card.Title>
            </Card.Header>
            <Card.Body>
              <EmptyPage.Root size="s" aria-labelledby="rules-empty">
                <EmptyPage.Icon tone="accent">
                  <Icon name="action.filter" />
                </EmptyPage.Icon>
                <EmptyPage.Title as="h3" id="rules-empty">
                  Правил пока нет
                </EmptyPage.Title>
                <EmptyPage.Description>
                  Правило свяжет платёж со счётом по ИНН или назначению.
                </EmptyPage.Description>
                <EmptyPage.Actions>
                  <Button.Root variant="soft" tone="neutral">
                    Создать правило
                  </Button.Root>
                </EmptyPage.Actions>
              </EmptyPage.Root>
            </Card.Body>
          </Card.Root>
        </div>

        <section className={styles.region} aria-labelledby="unmatched-title">
          <Typography as="h2" variant="title-m" id="unmatched-title">
            Неразнесённые платежи
          </Typography>
          <DataTable
            columns={COLUMNS}
            rows={status === "ready" ? PAYMENTS : []}
            getRowKey={(row) => row.id}
            paging="none"
            loading={status === "loading"}
            loadingRows={3}
            error={status === "error" ? "Платежи появятся после загрузки выписки" : undefined}
            empty="Все платежи разнесены"
          />
        </section>
      </PageContent.Body>
    </PageContent.Section>
  );
}
