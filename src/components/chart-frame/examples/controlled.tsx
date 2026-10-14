/** Lead sources with totals in the legend; the hidden series live in the page state and one button shows them all again — `hiddenSeries`, `onHiddenSeriesChange`. */
import { Button, ChartFrame, type ChartFrameSeries, chartColors } from "prime-ui-kit";
import * as React from "react";

const MONTHS = ["май", "июн", "июл", "авг", "сен", "окт"];

const LEADS: Record<string, number[]> = {
  site: [120, 134, 128, 151, 166, 172],
  partners: [64, 70, 81, 77, 92, 98],
  ads: [88, 79, 95, 102, 86, 110],
};

const SERIES: ChartFrameSeries[] = [
  { id: "site", label: "Сайт", value: 871 },
  { id: "partners", label: "Партнёры", value: 482 },
  { id: "ads", label: "Реклама", value: 560 },
];

const MARGIN = { top: 8, right: 16, bottom: 24, left: 32 };
const TOP = 200;

export default function ChartFrameControlledExample() {
  const [hidden, setHidden] = React.useState<string[]>(["ads"]);

  return (
    <ChartFrame.Root
      series={SERIES}
      hiddenSeries={hidden}
      onHiddenSeriesChange={setHidden}
      rows={MONTHS.map((month, i) => ({
        label: month,
        values: { site: LEADS.site[i], partners: LEADS.partners[i], ads: LEADS.ads[i] },
      }))}
    >
      <ChartFrame.Header>
        <ChartFrame.Title>Лиды по источникам</ChartFrame.Title>
        <ChartFrame.Description>Май — октябрь</ChartFrame.Description>
        <ChartFrame.Actions>
          <Button.Root
            variant="ghost"
            tone="neutral"
            disabled={hidden.length === 0}
            onClick={() => setHidden([])}
          >
            Показать все
          </Button.Root>
        </ChartFrame.Actions>
      </ChartFrame.Header>
      <ChartFrame.Plot
        renderPlot={({ width, height, series }) => {
          const innerW = width - MARGIN.left - MARGIN.right;
          const innerH = height - MARGIN.top - MARGIN.bottom;
          const x = (i: number) => MARGIN.left + (innerW * i) / (MONTHS.length - 1);
          const y = (v: number) => MARGIN.top + innerH * (1 - v / TOP);
          return (
            <svg width={width} height={height} aria-hidden="true">
              {[0, 100, 200].map((tick) => (
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
              {MONTHS.map((month, i) => (
                <text key={month} x={x(i)} y={height - 4} textAnchor="middle">
                  {month}
                </text>
              ))}
              {series.map((s) => (
                <path
                  key={s.id}
                  data-hidden={s.hidden}
                  d={LEADS[s.id].map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("")}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          );
        }}
      />
      <ChartFrame.Legend />
    </ChartFrame.Root>
  );
}
