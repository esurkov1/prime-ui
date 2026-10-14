/** A nested record: the path, the title with its status and due date and the record's actions by weight in the app header, a main column with the line items and a side column with the client's details and the history — `orientation`. */
import {
  AppHeader,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  DescriptionList,
  Dropdown,
  Icon,
  LinkButton,
  PageContent,
  PageToolbar,
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
    <>
      {/* A nested record titles itself in the app header: the path up to the list, the record as the
          only h1 with its status and due date under it, the record's actions in the tools row. */}
      <AppHeader.Root>
        <AppHeader.Start>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#invoices">Счета</Breadcrumb.Item>
          </Breadcrumb.Root>
          <AppHeader.Separator />
          <AppHeader.Title>
            Счёт № 2026-0418
            <AppHeader.Description>Отправлен · оплатить до 14 октября</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Tools>
          <PageToolbar.Root aria-label="Счёт № 2026-0418">
            <PageToolbar.Actions>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button.Root variant="soft" tone="neutral" aria-label="Другие действия">
                    <Button.Icon>
                      <Icon name="action.more" />
                    </Button.Icon>
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Item>Дублировать</Dropdown.Item>
                  <Dropdown.Item>Скачать PDF</Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item tone="danger">Аннулировать счёт</Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
              <Button.Root variant="soft" tone="neutral" aria-label="Напомнить клиенту">
                <Button.Icon>
                  <Icon name="action.send" />
                </Button.Icon>
              </Button.Root>
              <Button.Root>Отметить оплату</Button.Root>
            </PageToolbar.Actions>
          </PageToolbar.Root>
        </AppHeader.Tools>
      </AppHeader.Root>

      <PageContent.Root>
        <PageContent.Body>
          <div className={styles.columns}>
            <PageContent.Section label="Позиции" className={styles.main}>
              <DataTable
                columns={COLUMNS}
                rows={LINES}
                getRowKey={(row) => row.id}
                paging="none"
                highlightRowOnHover={false}
              />
              {/* Totals line up with the «Сумма» column of the table above: a layout of its own. */}
              <dl className={styles.totals}>
                {TOTALS.map((row) => (
                  <div key={row.label} className={styles.totalRow}>
                    <dt>
                      <Typography variant="body-m" tone="secondary">
                        {row.label}
                      </Typography>
                    </dt>
                    <dd>
                      <Typography variant="body-m" className={styles.amount}>
                        {row.value}
                      </Typography>
                    </dd>
                  </div>
                ))}
                <div className={styles.totalRow}>
                  <dt>
                    <Typography variant="title-m">К оплате</Typography>
                  </dt>
                  <dd>
                    <Typography variant="title-m" className={styles.amount}>
                      {MONEY.format(NET + VAT)}
                    </Typography>
                  </dd>
                </div>
              </dl>
            </PageContent.Section>
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
                          <Timeline.Title>{event.title}</Timeline.Title>
                          <Timeline.Meta>{event.date}</Timeline.Meta>
                        </Timeline.Item>
                      ))}
                    </Timeline.Group>
                  </Timeline.Root>
                </Card.Body>
              </Card.Root>
            </aside>
          </div>
        </PageContent.Body>
      </PageContent.Root>
    </>
  );
}
