/** Revenue against the plan beside two KPI tiles: the plot takes the height of the stretched grid cell, and the plan line starts hidden until the legend turns it on — `height`, `defaultHiddenSeries`. */
import { ChartFrame, type ChartFrameSeries, chartColors, Kpi, Page } from "prime-ui-kit";

const SERIES: ChartFrameSeries[] = [
  { id: "fact", label: "Факт" },
  { id: "plan", label: "План" },
];

const MONTHS = [
  { month: "май", fact: 6.2, plan: 6.0 },
  { month: "июн", fact: 6.8, plan: 6.5 },
  { month: "июл", fact: 6.4, plan: 7.0 },
  { month: "авг", fact: 7.1, plan: 7.4 },
  { month: "сен", fact: 7.5, plan: 7.8 },
  { month: "окт", fact: 7.9, plan: 8.2 },
];

const MARGIN = { top: 8, right: 16, bottom: 24, left: 32 };
const TICKS = [0, 3, 6, 9];

const formatMillions = (value: number) => `${value.toLocaleString("ru-RU")} млн ₽`;

export default function ChartFrameFillHeightExample() {
  return (
    <Page.Grid>
      {/* The cell spans two rows beside the tiles; `height="fill"` takes all of it. */}
      <Page.Cell span={8} rows={2}>
        <ChartFrame.Root
          series={SERIES}
          defaultHiddenSeries={["plan"]}
          formatValue={formatMillions}
          rows={MONTHS.map((row) => ({
            label: row.month,
            values: { fact: row.fact, plan: row.plan },
          }))}
        >
          <ChartFrame.Header>
            <ChartFrame.Title as="h2">Выручка и план</ChartFrame.Title>
            <ChartFrame.Description>По месяцам, млн ₽</ChartFrame.Description>
          </ChartFrame.Header>
          <ChartFrame.Value>
            7,9 млн ₽<ChartFrame.Delta tone="warning">−4% к плану</ChartFrame.Delta>
          </ChartFrame.Value>
          <ChartFrame.Plot
            height="fill"
            renderPlot={({ width, height, series }) => {
              const innerW = width - MARGIN.left - MARGIN.right;
              const innerH = height - MARGIN.top - MARGIN.bottom;
              const x = (i: number) => MARGIN.left + (innerW * i) / (MONTHS.length - 1);
              const y = (v: number) => MARGIN.top + innerH * (1 - v / TICKS[TICKS.length - 1]);
              return (
                <svg width={width} height={height} aria-hidden="true">
                  {TICKS.map((tick) => (
                    <g key={tick}>
                      <line
                        x1={MARGIN.left}
                        x2={width - MARGIN.right}
                        y1={y(tick)}
                        y2={y(tick)}
                        stroke={tick === 0 ? chartColors.axis : chartColors.grid}
                      />
                      <text
                        x={MARGIN.left - 8}
                        y={y(tick)}
                        textAnchor="end"
                        dominantBaseline="middle"
                      >
                        {tick}
                      </text>
                    </g>
                  ))}
                  {MONTHS.map((row, i) => (
                    <text key={row.month} x={x(i)} y={height - 4} textAnchor="middle">
                      {row.month}
                    </text>
                  ))}
                  {series.map((s) => (
                    <path
                      key={s.id}
                      data-hidden={s.hidden}
                      d={MONTHS.map(
                        (row, i) =>
                          `${i ? "L" : "M"}${x(i)},${y(s.id === "plan" ? row.plan : row.fact)}`,
                      ).join("")}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={2}
                      strokeDasharray={s.id === "plan" ? "4 4" : undefined}
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
              );
            }}
          />
          <ChartFrame.Legend />
        </ChartFrame.Root>
      </Page.Cell>

      <Page.Cell span={4}>
        <Kpi.Root>
          <Kpi.Title>Выполнение плана</Kpi.Title>
          <Kpi.Period>Октябрь</Kpi.Period>
          <Kpi.Value>96%</Kpi.Value>
          <Kpi.Delta value={-4} tone="warning">
            −4 п. п.
          </Kpi.Delta>
          <Kpi.Meta>к сентябрю</Kpi.Meta>
        </Kpi.Root>
      </Page.Cell>

      <Page.Cell span={4}>
        <Kpi.Root>
          <Kpi.Title>Прогноз на год</Kpi.Title>
          <Kpi.Period>2026</Kpi.Period>
          <Kpi.Value>84 млн ₽</Kpi.Value>
          <Kpi.Meta>План — 86 млн ₽</Kpi.Meta>
        </Kpi.Root>
      </Page.Cell>
    </Page.Grid>
  );
}
