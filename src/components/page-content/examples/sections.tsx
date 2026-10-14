/** A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading, a heading column beside a panel — `PageContent.Section`, `label`, `description`, `PageContent.Actions`, `layout`. */
import {
  Card,
  DataTable,
  type DataTableColumn,
  LinkButton,
  PageContent,
  Typography,
} from "prime-ui-kit";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; amount: number };

const INVOICES: Invoice[] = [
  { id: "СЧ-1042", client: "ООО «Север»", amount: 184_000 },
  { id: "СЧ-1041", client: "ИП Лаптева", amount: 42_500 },
  { id: "СЧ-1039", client: "АО «Техносфера»", amount: 610_000 },
];

const MONEY = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", cell: (row) => row.id },
  { id: "client", header: "Клиент", cell: (row) => row.client },
  {
    id: "amount",
    header: "Сумма",
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.amount),
  },
];

export default function PageContentSectionsExample() {
  return (
    <div className={styles.main}>
      <PageContent.Body>
        <PageContent.Grid>
          <PageContent.Cell span={6}>
            <Card.Root variant="stat-trend">
              <Card.Label>Выставлено</Card.Label>
              <Card.Value>2,4 млн ₽</Card.Value>
              <Card.Delta tone="success">+9% к сентябрю</Card.Delta>
            </Card.Root>
          </PageContent.Cell>
          <PageContent.Cell span={6}>
            <Card.Root variant="stat-trend">
              <Card.Label>Оплачено</Card.Label>
              <Card.Value>1,9 млн ₽</Card.Value>
              <Card.Delta tone="neutral">79% выставленного</Card.Delta>
            </Card.Root>
          </PageContent.Cell>
        </PageContent.Grid>
        <PageContent.Section label="Последние счета" description="Три последних за октябрь">
          <PageContent.Actions>
            <LinkButton href="#invoices">Все счета</LinkButton>
          </PageContent.Actions>
          <DataTable columns={COLUMNS} rows={INVOICES} getRowKey={(row) => row.id} paging="none" />
        </PageContent.Section>
        <PageContent.Section
          layout="aside"
          label="Реквизиты в счетах"
          description="Попадают в каждый новый счёт."
        >
          <Card.Root variant="panel">
            <Card.Body>
              <Typography variant="body-m" tone="secondary">
                ООО «Прайм Софт», ИНН 7701234567, р/с в Т-Банке.
              </Typography>
            </Card.Body>
          </Card.Root>
        </PageContent.Section>
      </PageContent.Body>
    </div>
  );
}
