/** Revenue by month as a hand-drawn SVG line chart in a dashboard panel: the headline with its change, a period switch, a legend that turns series off and a table for screen readers — `series`, `formatValue`, `renderPlot`. */
import { ChartFrame, type ChartFrameSeries, chartColors, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

type Point = { month: string; values: Record<string, number> };

const SERIES: ChartFrameSeries[] = [
  { id: "new", label: "Новые клиенты" },
  { id: "renewals", label: "Продления" },
];

const YEAR: Point[] = [
  { month: "ноя", values: { new: 1.9, renewals: 3.1 } },
  { month: "дек", values: { new: 2.4, renewals: 3.4 } },
  { month: "янв", values: { new: 1.6, renewals: 3.0 } },
  { month: "фев", values: { new: 2.1, renewals: 3.3 } },
  { month: "мар", values: { new: 2.8, renewals: 3.5 } },
  { month: "апр", values: { new: 2.6, renewals: 3.8 } },
  { month: "мая", values: { new: 3.0, renewals: 3.6 } },
  { month: "июн", values: { new: 3.4, renewals: 4.0 } },
  { month: "июл", values: { new: 3.1, renewals: 4.2 } },
  { month: "авг", values: { new: 3.6, renewals: 4.1 } },
  { month: "сен", values: { new: 3.9, renewals: 4.4 } },
  { month: "окт", values: { new: 4.2, renewals: 4.6 } },
];

const PERIODS = { half: YEAR.slice(6), year: YEAR };

const MARGIN = { top: 8, right: 16, bottom: 24, left: 40 };

const formatMillions = (value: number) => `${value.toLocaleString("ru-RU")} млн ₽`;

/** Round gridline steps from 0 to just above the largest value. */
function ticks(max: number): number[] {
  const step = max > 6 ? 2 : 1;
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step);
}

export default function ChartFrameOverviewExample() {
  const [period, setPeriod] = React.useState<keyof typeof PERIODS>("year");
  const points = PERIODS[period];
  const last = points[points.length - 1];
  const total = last.values.new + last.values.renewals;

  return (
    <ChartFrame.Root
      series={SERIES}
      formatValue={formatMillions}
      rows={points.map((p) => ({ label: p.month, values: p.values }))}
    >
      <ChartFrame.Header>
        <ChartFrame.Title>Выручка</ChartFrame.Title>
        <ChartFrame.Description>По месяцам, в млн ₽</ChartFrame.Description>
        <ChartFrame.Actions>
          <SegmentedControl.Root
            aria-label="Период"
            value={period}
            onValueChange={(next) => setPeriod(next as keyof typeof PERIODS)}
          >
            <SegmentedControl.Item value="half">6 мес</SegmentedControl.Item>
            <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
          </SegmentedControl.Root>
        </ChartFrame.Actions>
      </ChartFrame.Header>
      <ChartFrame.Value>
        {formatMillions(Math.round(total * 10) / 10)}
        <ChartFrame.Delta tone="success">+8% к сентябрю</ChartFrame.Delta>
      </ChartFrame.Value>
      <ChartFrame.Plot
        renderPlot={({ width, height, series }) => {
          const grid = ticks(Math.max(...points.flatMap((p) => Object.values(p.values))));
          const top = grid[grid.length - 1];
          const innerW = width - MARGIN.left - MARGIN.right;
          const innerH = height - MARGIN.top - MARGIN.bottom;
          const x = (i: number) => MARGIN.left + (innerW * i) / Math.max(points.length - 1, 1);
          const y = (v: number) => MARGIN.top + innerH * (1 - v / top);
          const labelStep = Math.ceil(points.length / Math.max(1, Math.floor(innerW / 44)));
          return (
            <svg width={width} height={height} aria-hidden="true">
              {grid.map((tick) => (
                <g key={tick}>
                  <line
                    x1={MARGIN.left}
                    x2={width - MARGIN.right}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke={tick === 0 ? chartColors.axis : chartColors.grid}
                  />
                  <text x={MARGIN.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle">
                    {tick}
                  </text>
                </g>
              ))}
              {points.map((point, i) =>
                // A narrow plot labels every second or third month, so the labels never collide.
                i % labelStep === 0 ? (
                  <text key={point.month} x={x(i)} y={height - 4} textAnchor="middle">
                    {point.month}
                  </text>
                ) : null,
              )}
              {series.map((s) => {
                const line = points
                  .map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.values[s.id])}`)
                  .join("");
                return (
                  <g key={s.id} data-hidden={s.hidden}>
                    <path
                      d={`${line}L${x(points.length - 1)},${y(0)}L${x(0)},${y(0)}Z`}
                      fill={s.color}
                      fillOpacity={0.08}
                    />
                    <path
                      d={line}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </svg>
          );
        }}
      />
      <ChartFrame.Legend />
    </ChartFrame.Root>
  );
}
