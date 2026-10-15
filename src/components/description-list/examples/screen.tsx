/** A nested record: the path, the title with its status and due date and the record's actions by weight in its top bar, a main column with the line items and their totals and a side column with the client's details and the history — `align`, `orientation`. */
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  DescriptionList,
  Icon,
  LinkButton,
  Page,
  Timeline,
  Typography,
} from "prime-ui-kit";

import styles from "./screen.module.css";

type Line = { id: string; name: string; quantity: number; unit: string; price: number };

const LINES: Line[] = [
  { id: "l1", name: "Лицензия CRM, тариф «Бизнес»", quantity: 25, unit: "мест", price: 12_000 },
  { id: "l2", name: "Внедрение и настройка", quantity: 40, unit: "ч", price: 3_500 },
  { id: "l3", name: "Обучение менеджеров", quantity: 2, unit: "дня", price: 18_000 },
];

const HISTORY = [
  { id: "h1", title: "Счёт открыт клиентом", date: "2 окт., 11:40" },
  { id: "h2", title: "Отправлен на billing@veter.ru", date: "30 сент., 16:05" },
  { id: "h3", title: "Создан · Анна Климова", date: "30 сент., 15:52" },
];

const MONEY = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const COUNT = new Intl.NumberFormat("ru-RU");

const NET = LINES.reduce((sum, line) => sum + line.quantity * line.price, 0);
const VAT = Math.round(NET * 0.2);

const TOTALS = [
  { label: "Без НДС", value: MONEY.format(NET) },
  { label: "НДС 20%", value: MONEY.format(VAT) },
];

const COLUMNS: DataTableColumn<Line>[] = [
  { id: "name", header: "Позиция", accessor: "name" },
  {
    id: "quantity",
    header: "Кол-во",
    numeric: true,
    headerAlign: "end",
    cell: (row) => `${COUNT.format(row.quantity)} ${row.unit}`,
  },
  {
    id: "price",
    header: "Цена",
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.price),
  },
  {
    id: "sum",
    header: "Сумма",
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.quantity * row.price),
  },
];

export default function DescriptionListScreenExample() {
  return (
    <Page.Root>
      {/* A nested record titles itself in its top bar: the path up to the list, the record as the
          only h1 with its status and due date under it, the record's actions at the end. */}

      <Page.TopBar>
        <Page.Heading>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#invoices">Счета</Breadcrumb.Item>
          </Breadcrumb.Root>
          <Page.Title>Счёт № 2026-0418</Page.Title>
          <Page.Description>Отправлен · оплатить до 14 октября</Page.Description>
        </Page.Heading>
        {/* By weight: when the row runs short the soft actions show only their icons, then fold
            into «⋯»; the primary action stays. */}
        <Page.Actions>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.copy" />
            </Button.Icon>
            Дублировать
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Скачать PDF
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.send" />
            </Button.Icon>
            Напомнить
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.check" />
            </Button.Icon>
            Отметить оплату
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
      <Page.Body>
        <div className={styles.columns}>
          <Page.Section label="Позиции" className={styles.main}>
            <DataTable
              columns={COLUMNS}
              rows={LINES}
              getRowKey={(row) => row.id}
              paging="none"
              highlightRowOnHover={false}
            />
            {/* The totals end where the «Сумма» column of the table above ends. */}
            <DescriptionList.Root align="end" className={styles.totals}>
              {TOTALS.map((row) => (
                <DescriptionList.Item key={row.label} label={row.label}>
                  {row.value}
                </DescriptionList.Item>
              ))}
              <DescriptionList.Item
                label={
                  <Typography as="span" variant="title-m">
                    К оплате
                  </Typography>
                }
              >
                <Typography as="span" variant="title-m" numeric="tabular">
                  {MONEY.format(NET + VAT)}
                </Typography>
              </DescriptionList.Item>
            </DescriptionList.Root>
          </Page.Section>
          <aside className={styles.aside} aria-label="Клиент и история">
            <Card.Root variant="panel">
              <Card.Header>
                <Card.Title as="h2">Клиент</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className={styles.client}>
                  <span className={styles.person}>
                    <Avatar.Root color="teal">
                      <Avatar.Fallback>СВ</Avatar.Fallback>
                    </Avatar.Root>
                    <span className={styles.personText}>
                      <Typography as="span" variant="title-s">
                        ООО «Северный ветер»
                      </Typography>
                      <Typography as="span" variant="caption" tone="muted">
                        ИНН 7704 512 908
                      </Typography>
                    </span>
                  </span>
                  <DescriptionList.Root orientation="vertical">
                    <DescriptionList.Item label="Контакт">
                      Ольга Мартынова, финансовый директор
                    </DescriptionList.Item>
                    <DescriptionList.Item label="Почта для счетов">
                      <LinkButton href="mailto:billing@veter.ru">billing@veter.ru</LinkButton>
                    </DescriptionList.Item>
                  </DescriptionList.Root>
                </div>
              </Card.Body>
            </Card.Root>
            <Card.Root variant="panel">
              <Card.Header>
                <Card.Title as="h2">История</Card.Title>
              </Card.Header>
              <Card.Body>
                <Timeline.Root>
                  <Timeline.Group>
                    {HISTORY.map((event) => (
                      <Timeline.Item key={event.id}>
                        <Timeline.ItemTitle>{event.title}</Timeline.ItemTitle>
                        <Timeline.ItemMeta>{event.date}</Timeline.ItemMeta>
                      </Timeline.Item>
                    ))}
                  </Timeline.Group>
                </Timeline.Root>
              </Card.Body>
            </Card.Root>
          </aside>
        </div>
      </Page.Body>
    </Page.Root>
  );
}
