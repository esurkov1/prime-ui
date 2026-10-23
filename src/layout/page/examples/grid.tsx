/** A dashboard board: four KPI tiles, a chart two rows high beside two panels, one gap on both axes — `Page.Grid`, `Page.Cell`, `span`, `rows`. */
import { ChartFrame, type ChartFrameSeries, chartColors, Kpi, Page } from "prime-ui-kit";

import styles from "./examples.module.css";

const KPIS = [
  { label: "Выручка", value: "4,8", unit: "млн ₽", change: 12, delta: "+12%", tone: "success" },
  { label: "Заказы", value: "1 284", unit: null, change: 6, delta: "+6%", tone: "success" },
  { label: "Средний чек", value: "3 740", unit: "₽", change: -2, delta: "−2%", tone: "danger" },
  { label: "Возвраты", value: "1,8", unit: "%", change: 0, delta: "0%", tone: "neutral" },
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

export default function PageGridExample() {
  return (
    <div className={styles.main}>
      <Page.Body>
        <Page.Grid>
          {KPIS.map((kpi) => (
            <Page.Cell key={kpi.label} span={3}>
              <Kpi.Root>
                <Kpi.Title>{kpi.label}</Kpi.Title>
                <Kpi.Value>
                  {kpi.value}
                  {kpi.unit ? <Kpi.Unit>{kpi.unit}</Kpi.Unit> : null}
                </Kpi.Value>
                <Kpi.Delta value={kpi.change} tone={kpi.tone}>
                  {kpi.delta}
                </Kpi.Delta>
                <Kpi.Period>Октябрь</Kpi.Period>
              </Kpi.Root>
            </Page.Cell>
          ))}
          <Page.Cell span={8} rows={2}>
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
          </Page.Cell>
          <Page.Cell span={4}>
            <Kpi.Root>
              <Kpi.Title>Новые клиенты</Kpi.Title>
              <Kpi.Value>86</Kpi.Value>
              <Kpi.Delta value={14} tone="success">
                +14
              </Kpi.Delta>
              <Kpi.Period>Октябрь</Kpi.Period>
            </Kpi.Root>
          </Page.Cell>
          <Page.Cell span={4}>
            <Kpi.Root>
              <Kpi.Title>Ждут оплаты</Kpi.Title>
              <Kpi.Value>
                312 400<Kpi.Unit>₽</Kpi.Unit>
              </Kpi.Value>
              <Kpi.Period>на 22 окт</Kpi.Period>
              <Kpi.Meta>7 счетов</Kpi.Meta>
            </Kpi.Root>
          </Page.Cell>
        </Page.Grid>
      </Page.Body>
    </div>
  );
}
