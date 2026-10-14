/** A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `PageContent.Grid`, `PageContent.Cell`, `span`, `rows`. */
import { Card, ChartFrame, type ChartFrameSeries, chartColors, PageContent } from "prime-ui-kit";

import styles from "./examples.module.css";

const KPIS = [
  { label: "Выручка", value: "4,8 млн ₽", delta: "+12% к сентябрю", tone: "success" },
  { label: "Заказы", value: "1 284", delta: "+6% к сентябрю", tone: "success" },
  { label: "Средний чек", value: "3 740 ₽", delta: "−2% к сентябрю", tone: "danger" },
  { label: "Возвраты", value: "1,8%", delta: "без изменений", tone: "neutral" },
] as const;

const SERIES: ChartFrameSeries[] = [{ id: "orders", label: "Заказы" }];

const WEEKS = [
  { week: "1 нед", orders: 268 },
  { week: "2 нед", orders: 301 },
  { week: "3 нед", orders: 287 },
  { week: "4 нед", orders: 334 },
  { week: "5 нед", orders: 352 },
];

const ROWS = WEEKS.map(({ week, orders }) => ({ label: week, values: { orders } }));

const MARGIN = { top: 8, right: 8, bottom: 24, left: 8 };

const formatOrders = (value: number) => `${value.toLocaleString("ru-RU")} заказов`;

export default function PageContentGridExample() {
  return (
    <div className={styles.main}>
      <PageContent.Body>
        <PageContent.Grid>
          {KPIS.map((kpi) => (
            <PageContent.Cell key={kpi.label} span={3}>
              <Card.Root variant="stat-trend">
                <Card.Label>{kpi.label}</Card.Label>
                <Card.Value>{kpi.value}</Card.Value>
                <Card.Delta tone={kpi.tone}>{kpi.delta}</Card.Delta>
              </Card.Root>
            </PageContent.Cell>
          ))}
          <PageContent.Cell span={8} rows={2}>
            <ChartFrame.Root series={SERIES} rows={ROWS} formatValue={formatOrders}>
              <ChartFrame.Header>
                <ChartFrame.Title>Заказы по неделям</ChartFrame.Title>
                <ChartFrame.Description>Октябрь</ChartFrame.Description>
              </ChartFrame.Header>
              <ChartFrame.Plot
                height="fill"
                renderPlot={({ width, height, series }) => {
                  const max = Math.max(...WEEKS.map((w) => w.orders));
                  const innerW = width - MARGIN.left - MARGIN.right;
                  const innerH = height - MARGIN.top - MARGIN.bottom;
                  const slot = innerW / WEEKS.length;
                  const bar = slot * 0.56;
                  return (
                    <svg width={width} height={height} aria-hidden="true">
                      <line
                        x1={MARGIN.left}
                        x2={width - MARGIN.right}
                        y1={MARGIN.top + innerH}
                        y2={MARGIN.top + innerH}
                        stroke={chartColors.axis}
                      />
                      {WEEKS.map((w, i) => {
                        const h = (innerH * w.orders) / max;
                        const x = MARGIN.left + slot * i + (slot - bar) / 2;
                        return (
                          <g key={w.week} data-hidden={series[0].hidden}>
                            <rect
                              x={x}
                              y={MARGIN.top + innerH - h}
                              width={bar}
                              height={h}
                              rx={4}
                              fill={series[0].color}
                            />
                            <text x={x + bar / 2} y={height - 4} textAnchor="middle">
                              {w.week}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  );
                }}
              />
            </ChartFrame.Root>
          </PageContent.Cell>
          <PageContent.Cell span={4}>
            <Card.Root variant="stat-trend">
              <Card.Label>Новые клиенты</Card.Label>
              <Card.Value>86</Card.Value>
              <Card.Delta tone="success">+14 к сентябрю</Card.Delta>
            </Card.Root>
          </PageContent.Cell>
          <PageContent.Cell span={4}>
            <Card.Root variant="stat-trend">
              <Card.Label>Ждут оплаты</Card.Label>
              <Card.Value>312 400 ₽</Card.Value>
              <Card.Delta tone="warning">7 счетов</Card.Delta>
            </Card.Root>
          </PageContent.Cell>
        </PageContent.Grid>
      </PageContent.Body>
    </div>
  );
}
