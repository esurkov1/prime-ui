/** A detail page: breadcrumb and status in the header, actions by weight, a main column with the line items and a side column with the client and the history. */
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  Dropdown,
  Icon,
  LinkButton,
  PageContent,
  Timeline,
  Typography,
} from "prime-ui-kit";

import styles from "./detail-page.module.css";

type Line = { id: string; name: string; quantity: number; unit: string; price: number };

const LINES: Line[] = [
  { id: "l1", name: "Лицензия CRM, тариф «Бизнес»", quantity: 25, unit: "мест", price: 12_000 },
  { id: "l2", name: "Внедрение и настройка", quantity: 40, unit: "ч", price: 3_500 },
  { id: "l3", name: "Обучение менеджеров", quantity: 2, unit: "дня", price: 18_000 },
];

const HISTORY = [
  { id: "h1", title: "Счёт открыт клиентом", date: "2 окт., 11:40", current: true },
  { id: "h2", title: "Отправлен на billing@veter.ru", date: "30 сент., 16:05", current: false },
  { id: "h3", title: "Создан · Анна Климова", date: "30 сент., 15:52", current: false },
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

export default function DetailPagePattern() {
  return (
    <PageContent.Section aria-labelledby="invoice-title">
      <PageContent.Header>
        <Breadcrumb.Root>
          <Breadcrumb.Item href="#invoices">Счета</Breadcrumb.Item>
          <Breadcrumb.Item current>№ 2026-0418</Breadcrumb.Item>
        </Breadcrumb.Root>
        <PageContent.Title id="invoice-title">Счёт № 2026-0418</PageContent.Title>
        <PageContent.Description>
          <span className={styles.status}>
            <Badge.Root color="blue">Отправлен</Badge.Root>
            Оплатить до 14 октября
          </span>
        </PageContent.Description>
        <PageContent.Actions>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="ghost" tone="neutral" aria-label="Другие действия">
                <Button.Icon>
                  <Icon name="action.more" />
                </Button.Icon>
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <Dropdown.Item>Дублировать</Dropdown.Item>
              <Dropdown.Item>Скачать PDF</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item tone="danger">Аннулировать счёт</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.send" />
            </Button.Icon>
            Напомнить
          </Button.Root>
          <Button.Root>Отметить оплату</Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <div className={styles.columns}>
          <section className={styles.main} aria-labelledby="invoice-lines">
            <Typography as="h2" variant="title-m" id="invoice-lines">
              Позиции
            </Typography>
            <DataTable
              columns={COLUMNS}
              rows={LINES}
              getRowKey={(row) => row.id}
              paging="none"
              highlightRowOnHover={false}
            />
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
          </section>
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
                  <dl className={styles.facts}>
                    <div className={styles.fact}>
                      <dt>
                        <Typography variant="caption" tone="muted">
                          Контакт
                        </Typography>
                      </dt>
                      <dd>
                        <Typography variant="body-m">
                          Ольга Мартынова, финансовый директор
                        </Typography>
                      </dd>
                    </div>
                    <div className={styles.fact}>
                      <dt>
                        <Typography variant="caption" tone="muted">
                          Почта для счетов
                        </Typography>
                      </dt>
                      <dd>
                        <Typography variant="body-m">
                          <LinkButton href="mailto:billing@veter.ru">billing@veter.ru</LinkButton>
                        </Typography>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card.Body>
            </Card.Root>
            <Card.Root variant="panel">
              <Card.Header>
                <Card.Title as="h2">История</Card.Title>
              </Card.Header>
              <Card.Body>
                <Timeline.Root highlight="current">
                  {HISTORY.map((event) => (
                    <Timeline.Item key={event.id} current={event.current}>
                      <Timeline.Title>{event.title}</Timeline.Title>
                      <Timeline.Meta>{event.date}</Timeline.Meta>
                    </Timeline.Item>
                  ))}
                </Timeline.Root>
              </Card.Body>
            </Card.Root>
          </aside>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
