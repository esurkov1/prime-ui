/** A page with titled sections: tiles of one screen close together, a new topic set off by air, a link at the end of the heading — `Page.Section`, `label`, `description`, `Page.Actions`. */
import { DataTable, type DataTableColumn, Kpi, LinkButton, Page } from "prime-ui-kit";

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

export default function PageSectionsExample() {
  return (
    <div className={styles.main}>
      <Page.Body>
        <Page.Grid>
          <Page.Cell span={6}>
            <Kpi.Root>
              <Kpi.Title>Выставлено</Kpi.Title>
              <Kpi.Value>
                2,4<Kpi.Unit>млн ₽</Kpi.Unit>
              </Kpi.Value>
              <Kpi.Delta value={9} tone="success">
                +9%
              </Kpi.Delta>
              <Kpi.Period>Октябрь</Kpi.Period>
            </Kpi.Root>
          </Page.Cell>
          <Page.Cell span={6}>
            <Kpi.Root>
              <Kpi.Title>Оплачено</Kpi.Title>
              <Kpi.Value>
                1,9<Kpi.Unit>млн ₽</Kpi.Unit>
              </Kpi.Value>
              <Kpi.Period>Октябрь</Kpi.Period>
              <Kpi.Meta>79% выставленного</Kpi.Meta>
            </Kpi.Root>
          </Page.Cell>
        </Page.Grid>
        <Page.Section label="Последние счета" description="Три последних за октябрь">
          <Page.Actions>
            <LinkButton href="#invoices">Все счета</LinkButton>
          </Page.Actions>
          <DataTable columns={COLUMNS} rows={INVOICES} getRowKey={(row) => row.id} paging="none" />
        </Page.Section>
      </Page.Body>
    </div>
  );
}
