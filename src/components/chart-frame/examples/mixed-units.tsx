/** Money and a count in one chart: revenue and expenses in baht as lines on the left axis, rentals as bars on the right one, each series formatted its own way in the legend, the tooltip, the table and on its axis — `series`, `formatValue`, `renderPlot`. */
import { ChartFrame, type ChartFrameSeries, chartColors, VisuallyHidden } from "prime-ui-kit";
import * as React from "react";

const MONTHS = [
  { label: "Май", revenue: 48600, expenses: 21400, rentals: 18 },
  { label: "Июнь", revenue: 54200, expenses: 23900, rentals: 21 },
  { label: "Июль", revenue: 61800, expenses: 26100, rentals: 26 },
  { label: "Август", revenue: 66400, expenses: 27800, rentals: 28 },
  { label: "Сентябрь", revenue: 58900, expenses: 25200, rentals: 24 },
  { label: "Октябрь", revenue: 72300, expenses: 29600, rentals: 31 },
];

const MARGIN = { top: 8, right: 64, bottom: 24, left: 64 };
const MONEY_TICKS = [0, 20000, 40000, 60000, 80000];
const COUNT_TICKS = [0, 10, 20, 30, 40];

const formatBaht = (value: number) => `${value.toLocaleString("ru-RU")} ฿`;

function formatRentals(value: number): string {
  const tens = value % 100;
  const ones = value % 10;
  const word =
    ones === 1 && tens !== 11
      ? "аренда"
      : ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)
        ? "аренды"
        : "аренд";
  return `${value.toLocaleString("ru-RU")} ${word}`;
}

const sum = (key: "revenue" | "expenses" | "rentals") =>
  MONTHS.reduce((total, month) => total + month[key], 0);

// Money takes the root's `formatValue`; the count brings its own.
const SERIES: ChartFrameSeries[] = [
  { id: "revenue", label: "Выручка", value: sum("revenue") },
  { id: "expenses", label: "Расходы", value: sum("expenses") },
  { id: "rentals", label: "Аренды", value: sum("rentals"), formatValue: formatRentals },
];

export default function ChartFrameMixedUnitsExample() {
  const [active, setActive] = React.useState<number | null>(null);
  // The pointer in plot coordinates; `null` while the arrow keys step through the months.
  const [pointer, setPointer] = React.useState<{ x: number; y: number } | null>(null);
  const month = active === null ? null : MONTHS[active];
  const spoken = month ?? MONTHS[0];

  return (
    <ChartFrame.Root
      series={SERIES}
      formatValue={formatBaht}
      rows={MONTHS.map(({ label, revenue, expenses, rentals }) => ({
        label,
        values: { revenue, expenses, rentals },
      }))}
    >
      <ChartFrame.Header>
        <ChartFrame.Title>Выручка, расходы и аренды</ChartFrame.Title>
        <ChartFrame.Description>По месяцам: деньги слева, аренды справа</ChartFrame.Description>
      </ChartFrame.Header>
      <ChartFrame.Plot
        renderPlot={({ width, height, series }) => {
          const [revenue, , rentals] = series;
          const innerW = width - MARGIN.left - MARGIN.right;
          const innerH = height - MARGIN.top - MARGIN.bottom;
          const band = innerW / MONTHS.length;
          const bar = Math.min(24, band / 2);
          const center = (i: number) => MARGIN.left + band * i + band / 2;
          const yMoney = (v: number) =>
            MARGIN.top + innerH * (1 - v / MONEY_TICKS[MONEY_TICKS.length - 1]);
          const yCount = (v: number) =>
            MARGIN.top + innerH * (1 - v / COUNT_TICKS[COUNT_TICKS.length - 1]);
          // Beside the pointer; from the keyboard beside the middle of the active month.
          const tooltipAt =
            active === null ? null : (pointer ?? { x: center(active), y: height / 2 });
          return (
            <div
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const index = Math.floor((event.clientX - rect.left - MARGIN.left) / band);
                setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                setActive(index >= 0 && index < MONTHS.length ? index : null);
              }}
              onPointerLeave={() => setActive(null)}
            >
              {/* The keyboard path: a native range steps through the months with the arrows. */}
              <VisuallyHidden>
                <input
                  type="range"
                  aria-label="Месяц"
                  min={0}
                  max={MONTHS.length - 1}
                  value={active ?? 0}
                  aria-valuetext={`${spoken.label}: выручка ${formatBaht(spoken.revenue)}, расходы ${formatBaht(spoken.expenses)}, ${formatRentals(spoken.rentals)}`}
                  onChange={(event) => {
                    setPointer(null);
                    setActive(Number(event.target.value));
                  }}
                  onFocus={() => setActive((current) => current ?? 0)}
                  onBlur={() => setActive(null)}
                />
              </VisuallyHidden>
              <svg width={width} height={height} aria-hidden="true">
                {MONEY_TICKS.map((tick, i) => (
                  <g key={tick}>
                    <line
                      x1={MARGIN.left}
                      x2={width - MARGIN.right}
                      y1={yMoney(tick)}
                      y2={yMoney(tick)}
                      stroke={tick === 0 ? chartColors.axis : chartColors.grid}
                    />
                    {/* Each axis speaks the format of the series on it. */}
                    <text
                      x={MARGIN.left - 8}
                      y={yMoney(tick)}
                      textAnchor="end"
                      dominantBaseline="middle"
                    >
                      {revenue.formatValue(tick)}
                    </text>
                    <text
                      x={width - MARGIN.right + 8}
                      y={yCount(COUNT_TICKS[i])}
                      dominantBaseline="middle"
                    >
                      {rentals.formatValue(COUNT_TICKS[i])}
                    </text>
                  </g>
                ))}
                {MONTHS.map((item, i) => (
                  <g key={item.label}>
                    <rect
                      x={MARGIN.left + band * i}
                      y={MARGIN.top}
                      width={band}
                      height={innerH}
                      fill={active === i ? chartColors.grid : "transparent"}
                    />
                    <rect
                      data-hidden={rentals.hidden}
                      x={center(i) - bar / 2}
                      y={yCount(item.rentals)}
                      width={bar}
                      height={yCount(0) - yCount(item.rentals)}
                      rx={2}
                      fill={rentals.color}
                    />
                    <text x={center(i)} y={height - 4} textAnchor="middle">
                      {item.label.slice(0, 3).toLowerCase()}
                    </text>
                  </g>
                ))}
                {series
                  .filter((s) => s.id !== "rentals")
                  .map((s) => (
                    <path
                      key={s.id}
                      data-hidden={s.hidden}
                      d={MONTHS.map(
                        (item, i) =>
                          `${i ? "L" : "M"}${center(i)},${yMoney(item[s.id as "revenue" | "expenses"])}`,
                      ).join("")}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  ))}
              </svg>
              <ChartFrame.Tooltip
                point={tooltipAt}
                label={month?.label}
                items={
                  month
                    ? [
                        { id: "revenue", value: month.revenue },
                        { id: "expenses", value: month.expenses },
                        { id: "rentals", value: month.rentals },
                      ]
                    : []
                }
              />
            </div>
          );
        }}
      />
      <ChartFrame.Legend />
    </ChartFrame.Root>
  );
}
