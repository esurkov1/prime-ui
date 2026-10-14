/** A dashboard: the title, a line of data, the period switch and the report in the app header; one grid of KPI tiles that cross-fade to the new period, a revenue trend, invoiced against paid beside two panels, and the latest payments with a link to the list — `AppHeader.Tools`, `PageContent.Grid`. */
import {
  AppHeader,
  Badge,
  Button,
  Card,
  ChartFrame,
  type ChartFrameSeries,
  Crossfade,
  chartColors,
  DataTable,
  type DataTableColumn,
  Icon,
  LinkButton,
  PageContent,
  PageToolbar,
  ProgressBar,
  type ProgressSegment,
  SegmentedControl,
  Sparkline,
  type SparklinePoint,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Period = "week" | "month" | "quarter";
type Payment = { id: string; client: string; date: string; amount: number; late: boolean };

const KPIS: Record<
  Period,
  { label: string; value: string; delta: string; tone: "success" | "danger" | "neutral" }[]
> = {
  week: [
    { label: "Выручка", value: "2,1 млн ₽", delta: "+6% к прошлой неделе", tone: "success" },
    { label: "Оплачено счетов", value: "54", delta: "+4", tone: "success" },
    { label: "Средний чек", value: "38 900 ₽", delta: "без изменений", tone: "neutral" },
    { label: "Просрочено", value: "1,2 млн ₽", delta: "+180 тыс. ₽", tone: "danger" },
  ],
  month: [
    { label: "Выручка", value: "8,4 млн ₽", delta: "+12% к сентябрю", tone: "success" },
    { label: "Оплачено счетов", value: "214", delta: "+17", tone: "success" },
    { label: "Средний чек", value: "39 300 ₽", delta: "−3% к сентябрю", tone: "danger" },
    { label: "Просрочено", value: "1,2 млн ₽", delta: "−340 тыс. ₽", tone: "success" },
  ],
  quarter: [
    { label: "Выручка", value: "24,6 млн ₽", delta: "+21% ко II кварталу", tone: "success" },
    { label: "Оплачено счетов", value: "631", delta: "+88", tone: "success" },
    { label: "Средний чек", value: "39 000 ₽", delta: "+1%", tone: "neutral" },
    { label: "Просрочено", value: "1,2 млн ₽", delta: "−1,1 млн ₽", tone: "success" },
  ],
};

const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

/** Daily revenue up to 8 October 2026: `days` points ending that day, a deterministic wave. */
function dailyRevenue(days: number, base: number): SparklinePoint[] {
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(2026, 9, 8 - (days - 1 - i));
    const wave = Math.sin(i / 2.3) * 0.12 + Math.sin(i / 0.9) * 0.05 + i / days / 6;
    return {
      label: `${day.getDate()} ${MONTHS[day.getMonth()]}`,
      value: Math.round((base * (1 + wave)) / 1000) * 1000,
    };
  });
}

const REVENUE: Record<Period, SparklinePoint[]> = {
  week: dailyRevenue(7, 300_000),
  month: dailyRevenue(30, 280_000),
  quarter: dailyRevenue(90, 270_000),
};

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

const BILLING_SERIES: ChartFrameSeries[] = [
  { id: "invoiced", label: "Выставлено" },
  { id: "paid", label: "Оплачено" },
];

/** Invoiced and paid, in millions of rubles, by the buckets of each period. */
const BILLING: Record<Period, { label: string; invoiced: number; paid: number }[]> = {
  week: [
    { label: "пн", invoiced: 0.42, paid: 0.31 },
    { label: "вт", invoiced: 0.38, paid: 0.4 },
    { label: "ср", invoiced: 0.51, paid: 0.36 },
    { label: "чт", invoiced: 0.47, paid: 0.44 },
    { label: "пт", invoiced: 0.56, paid: 0.52 },
  ],
  month: [
    { label: "нед 37", invoiced: 2.1, paid: 1.8 },
    { label: "нед 38", invoiced: 2.4, paid: 2.0 },
    { label: "нед 39", invoiced: 1.9, paid: 2.2 },
    { label: "нед 40", invoiced: 2.6, paid: 2.1 },
  ],
  quarter: [
    { label: "авг", invoiced: 7.8, paid: 6.9 },
    { label: "сен", invoiced: 8.1, paid: 7.6 },
    { label: "окт", invoiced: 8.9, paid: 8.4 },
  ],
};

const BILLING_MARGIN = { top: 8, bottom: 24, left: 36 };

const formatMillionsShort = (value: number) => `${value.toLocaleString("ru-RU")} млн ₽`;

const PLAN = [
  { manager: "Анна Климова", value: 92 },
  { manager: "Илья Петров", value: 74 },
  { manager: "Марат Хасанов", value: 48 },
];

/** Display of an amount in millions: «5,1 млн ₽». */
const formatMillions = (value: number) => `${String(value).replace(".", ",")} млн ₽`;

const RECEIVABLES: ProgressSegment[] = [
  { value: 5.1, label: "В срок", tone: "success" },
  { value: 1.9, label: "До 30 дней", tone: "warning" },
  { value: 1.2, label: "Больше 30 дней", tone: "danger" },
];

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

export default function CardScreenExample() {
  const [period, setPeriod] = React.useState<Period>("month");

  return (
    <>
      {/* In an app this header fills the shell's `header` slot and carries the page: the only h1,
          a line of data under it and the page's tools; main has no PageContent.Header. */}
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            Обзор
            <AppHeader.Description>Продажи и оплаты · на 8 октября, 9:40</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Tools>
          <PageToolbar.Root aria-label="Обзор">
            <PageToolbar.View>
              <SegmentedControl.Root
                aria-label="Период"
                value={period}
                onValueChange={(next) => setPeriod(next as Period)}
              >
                <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
                <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
                <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
              </SegmentedControl.Root>
            </PageToolbar.View>
            <PageToolbar.Actions>
              <Button.Root variant="soft" tone="neutral">
                <Button.Icon>
                  <Icon name="action.download" />
                </Button.Icon>
                Отчёт
              </Button.Root>
            </PageToolbar.Actions>
          </PageToolbar.Root>
        </AppHeader.Tools>
      </AppHeader.Root>

      <PageContent.Root>
        <PageContent.Body>
          {/* One board: every tile of the screen in one grid, 16 apart on both axes. */}
          <PageContent.Grid>
            {KPIS[period].map((kpi) => (
              <PageContent.Cell key={kpi.label} span={3}>
                {/* Another period is another set of values: the tile cross-fades instead of flipping. */}
                <Crossfade state={period}>
                  <Card.Root variant="stat-trend">
                    <Card.Label>{kpi.label}</Card.Label>
                    <Card.Value>{kpi.value}</Card.Value>
                    <Card.Delta tone={kpi.tone}>{kpi.delta}</Card.Delta>
                  </Card.Root>
                </Crossfade>
              </PageContent.Cell>
            ))}

            <PageContent.Cell>
              <Card.Root variant="panel">
                <Card.Body>
                  <Sparkline
                    data={REVENUE[period]}
                    label="Выручка по дням"
                    summary="sum"
                    formatValue={formatRubles}
                  />
                </Card.Body>
              </Card.Root>
            </PageContent.Cell>

            {/* The chart spans two rows beside the two panels and fills their height. */}
            <PageContent.Cell span={8} rows={2}>
              <ChartFrame.Root series={BILLING_SERIES} formatValue={formatMillionsShort}>
                <ChartFrame.Header>
                  <ChartFrame.Title as="h2">Выставлено и оплачено</ChartFrame.Title>
                  <ChartFrame.Description>Счета за период, млн ₽</ChartFrame.Description>
                </ChartFrame.Header>
                <ChartFrame.Plot
                  height="fill"
                  renderPlot={({ width, height, series }) => {
                    const rows = BILLING[period];
                    const top = Math.ceil(Math.max(...rows.map((row) => row.invoiced)));
                    const innerH = height - BILLING_MARGIN.top - BILLING_MARGIN.bottom;
                    const band = (width - BILLING_MARGIN.left) / rows.length;
                    const bar = Math.min(28, (band - 16) / series.length);
                    const y = (value: number) => BILLING_MARGIN.top + innerH * (1 - value / top);
                    return (
                      <svg width={width} height={height} aria-hidden="true">
                        {[0, top / 2, top].map((tick) => (
                          <g key={tick}>
                            <line
                              x1={BILLING_MARGIN.left}
                              x2={width}
                              y1={y(tick)}
                              y2={y(tick)}
                              stroke={tick === 0 ? chartColors.axis : chartColors.grid}
                            />
                            <text
                              x={BILLING_MARGIN.left - 8}
                              y={y(tick)}
                              textAnchor="end"
                              dominantBaseline="middle"
                            >
                              {tick.toLocaleString("ru-RU")}
                            </text>
                          </g>
                        ))}
                        {rows.map((row, i) => {
                          const center = BILLING_MARGIN.left + band * i + band / 2;
                          return (
                            <g key={row.label}>
                              {series.map((s, j) => {
                                const value = s.id === "paid" ? row.paid : row.invoiced;
                                return (
                                  <rect
                                    key={s.id}
                                    data-hidden={s.hidden}
                                    x={center - (bar * series.length) / 2 + bar * j}
                                    y={y(value)}
                                    width={bar - 2}
                                    height={y(0) - y(value)}
                                    rx={2}
                                    fill={s.color}
                                  />
                                );
                              })}
                              <text x={center} y={height - 4} textAnchor="middle">
                                {row.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  }}
                />
                <ChartFrame.Legend />
                <ChartFrame.Table
                  rows={BILLING[period].map((row) => ({
                    label: row.label,
                    values: { invoiced: row.invoiced, paid: row.paid },
                  }))}
                />
              </ChartFrame.Root>
            </PageContent.Cell>

            <PageContent.Cell span={4}>
              <Card.Root variant="panel">
                <Card.Header>
                  <Card.Title as="h2">План продаж</Card.Title>
                  <Typography as="span" variant="caption" tone="muted">
                    Октябрь
                  </Typography>
                </Card.Header>
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
            </PageContent.Cell>

            <PageContent.Cell span={4}>
              <Card.Root variant="panel">
                <Card.Header>
                  <Card.Title as="h2">Дебиторка</Card.Title>
                  <Typography as="span" variant="caption" tone="muted">
                    8,2 млн ₽
                  </Typography>
                </Card.Header>
                <Card.Body>
                  <ProgressBar
                    segments={RECEIVABLES}
                    label="По сроку оплаты"
                    legend
                    formatValue={formatMillions}
                  />
                </Card.Body>
              </Card.Root>
            </PageContent.Cell>
          </PageContent.Grid>

          {/* A new topic: a titled section, set off by more air than the tiles. */}
          <PageContent.Section label="Последние оплаты">
            <PageContent.Actions>
              <LinkButton href="#invoices">Все счета</LinkButton>
            </PageContent.Actions>
            <DataTable
              columns={COLUMNS}
              rows={PAYMENTS}
              getRowKey={(row) => row.id}
              paging="none"
            />
          </PageContent.Section>
        </PageContent.Body>
      </PageContent.Root>
    </>
  );
}
