/** A list page: header with one primary action, SmartFilter in the table toolbar, DataTable with statuses, row actions, pages and a filtered empty state. */
import {
  Avatar,
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  Dropdown,
  EmptyPage,
  Icon,
  matchesSmartFilter,
  PageContent,
  type PaletteColor,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./list-page.module.css";

type Status = "draft" | "sent" | "paid" | "overdue";

type Invoice = {
  id: string;
  client: string;
  inn: string;
  manager: string;
  due: string;
  amount: number;
  status: Status;
};

/** One hue per status across the product: the text carries the meaning, the color repeats it. */
const STATUS: Record<Status, { label: string; color: PaletteColor }> = {
  draft: { label: "Черновик", color: "gray" },
  sent: { label: "Отправлен", color: "blue" },
  paid: { label: "Оплачен", color: "green" },
  overdue: { label: "Просрочен", color: "red" },
};

const INVOICES: Invoice[] = [
  {
    id: "2026-0418",
    client: "ООО «Северный ветер»",
    inn: "7704 512 908",
    manager: "Анна Климова",
    due: "2026-10-14",
    amount: 486_000,
    status: "sent",
  },
  {
    id: "2026-0417",
    client: "АО «Техностиль»",
    inn: "7816 330 147",
    manager: "Илья Петров",
    due: "2026-10-02",
    amount: 1_240_500,
    status: "overdue",
  },
  {
    id: "2026-0416",
    client: "ИП Соколова М. А.",
    inn: "5024 118 773",
    manager: "Анна Климова",
    due: "2026-10-20",
    amount: 58_900,
    status: "draft",
  },
  {
    id: "2026-0415",
    client: "ООО «Логистик Плюс»",
    inn: "6658 402 215",
    manager: "Марат Хасанов",
    due: "2026-09-30",
    amount: 312_000,
    status: "paid",
  },
  {
    id: "2026-0414",
    client: "ООО «Гранит»",
    inn: "5407 221 690",
    manager: "Илья Петров",
    due: "2026-09-28",
    amount: 94_750,
    status: "paid",
  },
  {
    id: "2026-0413",
    client: "ЗАО «Альфа Медиа»",
    inn: "7702 845 336",
    manager: "Марат Хасанов",
    due: "2026-09-25",
    amount: 760_000,
    status: "overdue",
  },
  {
    id: "2026-0412",
    client: "ООО «Зелёный квартал»",
    inn: "2310 194 552",
    manager: "Анна Климова",
    due: "2026-10-18",
    amount: 205_300,
    status: "sent",
  },
  {
    id: "2026-0411",
    client: "ООО «Мостострой»",
    inn: "7728 609 481",
    manager: "Илья Петров",
    due: "2026-09-21",
    amount: 2_480_000,
    status: "paid",
  },
  {
    id: "2026-0410",
    client: "ООО «Пекарня №1»",
    inn: "7811 077 264",
    manager: "Марат Хасанов",
    due: "2026-10-25",
    amount: 37_200,
    status: "draft",
  },
  {
    id: "2026-0409",
    client: "АО «Волга-Энерго»",
    inn: "6316 255 018",
    manager: "Анна Климова",
    due: "2026-09-18",
    amount: 1_095_000,
    status: "paid",
  },
];

const MONEY = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const DAY = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

const asOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const FIELDS: SmartFilterField[] = [
  {
    key: "status",
    label: "Статус",
    options: (Object.keys(STATUS) as Status[]).map((value) => ({
      value,
      label: STATUS[value].label,
    })),
  },
  {
    key: "manager",
    label: "Менеджер",
    finite: false,
    options: asOptions(["Анна Климова", "Илья Петров", "Марат Хасанов"]),
  },
];

const initials = (name: string) =>
  name
    .replace(/^(ООО|АО|ЗАО|ИП)\s+/, "")
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const COLUMNS: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", accessor: "id", sortable: true, numeric: true, align: "start" },
  {
    id: "client",
    header: "Клиент",
    accessor: "client",
    sortable: true,
    cell: (row) => (
      <span className={styles.client}>
        <Avatar.Root size="s" color="gray">
          <Avatar.Fallback>{initials(row.client)}</Avatar.Fallback>
        </Avatar.Root>
        <span className={styles.clientText}>
          <Typography as="span" variant="body-m">
            {row.client}
          </Typography>
          <Typography as="span" variant="caption" tone="muted">
            ИНН {row.inn}
          </Typography>
        </span>
      </span>
    ),
  },
  {
    id: "status",
    header: "Статус",
    accessor: "status",
    cell: (row) => (
      <Badge.Root color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  {
    id: "due",
    header: "Оплатить до",
    accessor: "due",
    sortable: true,
    numeric: true,
    headerAlign: "end",
    cell: (row) => DAY.format(new Date(row.due)),
  },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    sortable: true,
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.amount),
  },
  {
    id: "actions",
    header: "",
    width: "3.5rem",
    align: "end",
    cell: (row) => (
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root
            size="s"
            variant="ghost"
            tone="neutral"
            aria-label={`Действия со счётом ${row.id}`}
          >
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          <Dropdown.Item>Открыть</Dropdown.Item>
          <Dropdown.Item>Скачать PDF</Dropdown.Item>
          <Dropdown.Item>Отправить повторно</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item tone="danger">Удалить</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
  },
];

export default function ListPagePattern() {
  const [filter, setFilter] = React.useState<SmartFilterValue>({});
  const [search, setSearch] = React.useState("");

  const query = search.trim().toLowerCase();
  const rows = INVOICES.filter(
    (row) =>
      matchesSmartFilter(filter.status, row.status) &&
      matchesSmartFilter(filter.manager, row.manager) &&
      (row.id.includes(query) || row.client.toLowerCase().includes(query)),
  );

  const resetFilters = () => {
    setFilter({});
    setSearch("");
  };

  return (
    <PageContent.Section aria-labelledby="invoices-title">
      <PageContent.Header>
        <PageContent.Title id="invoices-title">Счета</PageContent.Title>
        <PageContent.Description>
          Выставленные клиентам счета и статус их оплаты.
        </PageContent.Description>
        <PageContent.Actions>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Экспорт
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новый счёт
          </Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <DataTable
          columns={COLUMNS}
          rows={rows}
          getRowKey={(row) => row.id}
          getRowLabel={(row) => `Счёт ${row.id}`}
          pageSize={6}
          stickyFirstColumn
          defaultSort={{ columnId: "due", order: "desc" }}
          toolbar={
            <SmartFilter.Root
              fields={FIELDS}
              value={filter}
              onValueChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              className={styles.filter}
            >
              <SmartFilter.Toolbar />
              <SmartFilter.Chips />
            </SmartFilter.Root>
          }
          empty={
            <EmptyPage.Root size="s" role="status" aria-labelledby="invoices-empty">
              <EmptyPage.Icon>
                <Icon name="action.search" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="p" id="invoices-empty">
                Счетов не найдено
              </EmptyPage.Title>
              <EmptyPage.Description>Измените запрос или сбросьте фильтры.</EmptyPage.Description>
              <EmptyPage.Actions>
                <Button.Root variant="outline" tone="neutral" onClick={resetFilters}>
                  Сбросить фильтры
                </Button.Root>
              </EmptyPage.Actions>
            </EmptyPage.Root>
          }
        />
      </PageContent.Body>
    </PageContent.Section>
  );
}
