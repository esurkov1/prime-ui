/** A dashboard: the period switch in the header, a KPI row, panels with plan progress and the receivables split, and a short table with a link to the full list. */
import {
  Badge,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  Icon,
  LinkButton,
  PageContent,
  ProgressBar,
  type ProgressSegment,
  SegmentedControl,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./dashboard.module.css";

type Period = "week" | "month" | "quarter";
type Payment = { id: string; client: string; date: string; amount: number; late: boolean };

const KPIS: Record<
  Period,
  { label: string; value: string; delta: string; tone: "success" | "danger" | "neutral" }[]
> = {
  week: [
    { label: "Выручка", value: "₽ 2,1 млн", delta: "+6% к прошлой неделе", tone: "success" },
    { label: "Оплачено счетов", value: "54", delta: "+4", tone: "success" },
    { label: "Средний чек", value: "₽ 38 900", delta: "без изменений", tone: "neutral" },
    { label: "Просрочено", value: "₽ 1,2 млн", delta: "+₽ 180 тыс.", tone: "danger" },
  ],
  month: [
    { label: "Выручка", value: "₽ 8,4 млн", delta: "+12% к сентябрю", tone: "success" },
    { label: "Оплачено счетов", value: "214", delta: "+17", tone: "success" },
    { label: "Средний чек", value: "₽ 39 300", delta: "−3% к сентябрю", tone: "danger" },
    { label: "Просрочено", value: "₽ 1,2 млн", delta: "−₽ 340 тыс.", tone: "success" },
  ],
  quarter: [
    { label: "Выручка", value: "₽ 24,6 млн", delta: "+21% ко II кварталу", tone: "success" },
    { label: "Оплачено счетов", value: "631", delta: "+88", tone: "success" },
    { label: "Средний чек", value: "₽ 39 000", delta: "+1%", tone: "neutral" },
    { label: "Просрочено", value: "₽ 1,2 млн", delta: "−₽ 1,1 млн", tone: "success" },
  ],
};

const PLAN = [
  { manager: "Анна Климова", value: 92 },
  { manager: "Илья Петров", value: 74 },
  { manager: "Марат Хасанов", value: 48 },
];

const RECEIVABLES: ProgressSegment[] = [
  { value: 5.1, label: "В срок", tone: "success" },
  { value: 1.9, label: "До 30 дней", tone: "warning" },
  { value: 1.2, label: "Больше 30 дней", tone: "danger" },
];

/** Legend hue for each segment tone: the same hue the bar paints. */
const LEGEND_COLOR = {
  success: "green",
  warning: "orange",
  danger: "red",
  accent: "blue",
  neutral: "gray",
  info: "sky",
} as const;

const PAYMENTS: Payment[] = [
  { id: "p1", client: "ООО «Мостострой»", date: "7 окт.", amount: 2_480_000, late: false },
  { id: "p2", client: "АО «Волга-Энерго»", date: "6 окт.", amount: 1_095_000, late: false },
  { id: "p3", client: "ООО «Логистик Плюс»", date: "5 окт.", amount: 312_000, late: true },
  { id: "p4", client: "ООО «Гранит»", date: "3 окт.", amount: 94_750, late: false },
];

const MONEY = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Payment>[] = [
  {
    id: "client",
    header: "Клиент",
    cell: (row) => (
      <span className={styles.client}>
        {row.client}
        {row.late ? <Badge.Root color="orange">С опозданием</Badge.Root> : null}
      </span>
    ),
  },
  { id: "date", header: "Дата", accessor: "date", numeric: true, headerAlign: "end" },
  {
    id: "amount",
    header: "Сумма",
    numeric: true,
    headerAlign: "end",
    cell: (row) => MONEY.format(row.amount),
  },
];

export default function DashboardPattern() {
  const [period, setPeriod] = React.useState<Period>("month");

  return (
    <PageContent.Section aria-labelledby="dashboard-title">
      <PageContent.Header>
        <PageContent.Title id="dashboard-title">Обзор</PageContent.Title>
        <PageContent.Description>Продажи и оплаты по всем менеджерам.</PageContent.Description>
        <PageContent.Actions>
          <SegmentedControl.Root
            aria-label="Период"
            value={period}
            onValueChange={(next) => setPeriod(next as Period)}
          >
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
            <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
          </SegmentedControl.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Отчёт
          </Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <div className={styles.kpis}>
          {KPIS[period].map((kpi) => (
            <Card.Root key={kpi.label} variant="stat-trend">
              <Card.Label>{kpi.label}</Card.Label>
              <Card.Value>{kpi.value}</Card.Value>
              <Card.Delta tone={kpi.tone}>{kpi.delta}</Card.Delta>
            </Card.Root>
          ))}
        </div>

        <div className={styles.panels}>
          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle as="h2">План продаж</Card.SectionTitle>
              <Card.SectionTrailing>
                <Typography as="span" variant="caption" tone="muted">
                  Октябрь
                </Typography>
              </Card.SectionTrailing>
            </Card.SectionHeader>
            <Card.Body>
              <div className={styles.bars}>
                {PLAN.map((row) => (
                  <ProgressBar
                    key={row.manager}
                    value={row.value}
                    label={row.manager}
                    tone={row.value < 50 ? "warning" : "accent"}
                    showValue
                  />
                ))}
              </div>
            </Card.Body>
          </Card.Root>

          <Card.Root variant="panel">
            <Card.SectionHeader>
              <Card.SectionTitle as="h2">Дебиторка</Card.SectionTitle>
              <Card.SectionTrailing>
                <Typography as="span" variant="caption" tone="muted">
                  ₽ 8,2 млн
                </Typography>
              </Card.SectionTrailing>
            </Card.SectionHeader>
            <Card.Body>
              <div className={styles.bars}>
                <ProgressBar segments={RECEIVABLES} label="По сроку оплаты, млн ₽" />
                <ul className={styles.legend}>
                  {RECEIVABLES.map((part) => (
                    <li key={part.label} className={styles.legendRow}>
                      <Badge.Root color={LEGEND_COLOR[part.tone ?? "accent"]}>
                        <Badge.Dot />
                        {part.label}
                      </Badge.Root>
                      <Typography as="span" variant="body-m" className={styles.amount}>
                        ₽ {String(part.value).replace(".", ",")} млн
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card.Root>
        </div>

        <section className={styles.recent} aria-labelledby="payments-title">
          <div className={styles.recentHeader}>
            <Typography as="h2" variant="title-m" id="payments-title">
              Последние оплаты
            </Typography>
            <LinkButton href="#invoices">Все счета</LinkButton>
          </div>
          <DataTable columns={COLUMNS} rows={PAYMENTS} getRowKey={(row) => row.id} paging="none" />
        </section>
      </PageContent.Body>
    </PageContent.Section>
  );
}
