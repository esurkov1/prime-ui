/** Screen states: the title and the date of the statement in its top bar, a page-level error in a Banner with a retry, a region loading with a Skeleton of its rows and a table skeleton, the table error in place and a first-run EmptyPage; regions cross-fade between states — `state`. */
import {
  Banner,
  Button,
  Card,
  Crossfade,
  DataTable,
  type DataTableColumn,
  DescriptionList,
  EmptyPage,
  Icon,
  Page,
  Skeleton,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Status = "error" | "loading" | "ready";
type Payment = { id: string; payer: string; purpose: string; amount: number };

const PAYMENTS: Payment[] = [
  { id: "b1", payer: "ООО «Гранит»", purpose: "Оплата по сч. 2026-0414", amount: 94_750 },
  { id: "b2", payer: "ИП Орлов Д. С.", purpose: "Предоплата за обучение", amount: 18_000 },
  { id: "b3", payer: "АО «Альфа Медиа»", purpose: "Без указания счёта", amount: 380_000 },
];

const ACCOUNTS = [
  { name: "Т-Банк, расчётный", balance: "4 812 300 ₽" },
  { name: "Сбербанк, расчётный", balance: "1 207 950 ₽" },
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

export default function CrossfadeScreenExample() {
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
    <Page.Root>
      {/* A work screen titles itself in its top bar: the only h1 and a line of data, here the date of
          the last statement — it moves on once the statement arrives. */}

      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Сверка с банком</Page.Title>
          <Page.Description>
            2 счёта · выписка на {status === "ready" ? "7" : "6"} октября
          </Page.Description>
        </Page.Heading>
      </Page.TopBar>
      <Page.Body>
        {/* The page banner and the panels are one block: the banner, with the 40 below it, comes and
            goes inside a Crossfade, so the panels glide instead of jumping. */}
        <div className={styles.lead}>
          <Crossfade state={status === "error" ? "error" : "ok"}>
            {status === "error" ? (
              <div className={styles.bannerSlot}>
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
                      <Button.Root tone="danger" onClick={retry}>
                        Повторить
                      </Button.Root>
                    </Banner.Actions>
                  </Banner.Content>
                </Banner.Root>
              </div>
            ) : null}
          </Crossfade>

          <Page.Grid>
            <Page.Cell span={6}>
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
                    {/* The accounts are known: only their balances wait, as bars of the value. */}
                    <DescriptionList.Root>
                      {ACCOUNTS.map((account) => (
                        <DescriptionList.Item key={account.name} label={account.name}>
                          {status === "loading" ? (
                            <Skeleton className={styles.balanceBar} />
                          ) : (
                            account.balance
                          )}
                        </DescriptionList.Item>
                      ))}
                    </DescriptionList.Root>
                  </Crossfade>
                </Card.Body>
              </Card.Root>
            </Page.Cell>

            <Page.Cell span={6}>
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
            </Page.Cell>
          </Page.Grid>
        </div>

        <Page.Section label="Неразнесённые платежи">
          <DataTable
            columns={COLUMNS}
            rows={status === "ready" ? PAYMENTS : []}
            getRowKey={(row) => row.id}
            paging="none"
            loading={status === "loading"}
            loadingRows={3}
            loadError={status === "error" ? "Платежи появятся после загрузки выписки" : undefined}
            empty="Все платежи разнесены"
          />
        </Page.Section>
      </Page.Body>
    </Page.Root>
  );
}
