/** Invoices by week as grouped bars: pointing at a week or stepping with the arrows shows the kit tooltip body with a row per series — `ChartFrame.Tooltip`, `items`. */
import { ChartFrame, type ChartFrameSeries, chartColors } from "prime-ui-kit";
import * as React from "react";

const SERIES: ChartFrameSeries[] = [
  { id: "paid", label: "Оплачены" },
  { id: "pending", label: "Ждут оплаты" },
];

const WEEKS = [
  { label: "Неделя 36", paid: 42, pending: 11 },
  { label: "Неделя 37", paid: 38, pending: 15 },
  { label: "Неделя 38", paid: 51, pending: 9 },
  { label: "Неделя 39", paid: 47, pending: 14 },
  { label: "Неделя 40", paid: 56, pending: 12 },
  { label: "Неделя 41", paid: 61, pending: 8 },
];

const MARGIN = { top: 8, right: 0, bottom: 24, left: 32 };
const TICKS = [0, 20, 40, 60];
const TOOLTIP = { width: 176, height: 88 };

const formatCount = (value: number) => `${value} шт.`;

export default function ChartFrameTooltipExample() {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <ChartFrame.Root series={SERIES} formatValue={formatCount}>
      <ChartFrame.Header>
        <ChartFrame.Title>Счета по неделям</ChartFrame.Title>
        <ChartFrame.Description>Выставлено за последние 6 недель</ChartFrame.Description>
      </ChartFrame.Header>
      <ChartFrame.Plot
        renderPlot={({ width, height, series }) => {
          const innerW = width - MARGIN.left - MARGIN.right;
          const innerH = height - MARGIN.top - MARGIN.bottom;
          const band = innerW / WEEKS.length;
          const bar = Math.min(24, (band - 16) / series.length);
          const y = (v: number) => MARGIN.top + innerH * (1 - v / TICKS[TICKS.length - 1]);
          const point = active === null ? null : WEEKS[active];
          const tooltipX =
            active === null
              ? 0
              : Math.min(
                  Math.max(MARGIN.left + band * active + band / 2 - TOOLTIP.width / 2, 0),
                  width - TOOLTIP.width,
                );
          return (
            <div
              role="slider"
              tabIndex={0}
              aria-label="Неделя"
              aria-valuemin={0}
              aria-valuemax={WEEKS.length - 1}
              aria-valuenow={active ?? 0}
              aria-valuetext={`${(point ?? WEEKS[0]).label}: оплачены ${(point ?? WEEKS[0]).paid}, ждут оплаты ${(point ?? WEEKS[0]).pending}`}
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const index = Math.floor((event.clientX - rect.left - MARGIN.left) / band);
                setActive(index >= 0 && index < WEEKS.length ? index : null);
              }}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive((current) => current ?? 0)}
              onBlur={() => setActive(null)}
              onKeyDown={(event) => {
                const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
                if (!step) return;
                event.preventDefault();
                setActive((current) =>
                  Math.min(Math.max((current ?? 0) + step, 0), WEEKS.length - 1),
                );
              }}
            >
              <svg width={width} height={height} aria-hidden="true">
                {TICKS.map((tick) => (
                  <g key={tick}>
                    <line
                      x1={MARGIN.left}
                      x2={width}
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
                {WEEKS.map((week, i) => {
                  const left = MARGIN.left + band * i;
                  return (
                    <g key={week.label}>
                      <rect
                        x={left}
                        y={MARGIN.top}
                        width={band}
                        height={innerH}
                        fill={active === i ? chartColors.grid : "transparent"}
                      />
                      {series.map((s, j) => {
                        const value = s.id === "paid" ? week.paid : week.pending;
                        return (
                          <rect
                            key={s.id}
                            data-hidden={s.hidden}
                            x={left + band / 2 - (bar * series.length) / 2 + bar * j}
                            y={y(value)}
                            width={bar - 2}
                            height={y(0) - y(value)}
                            rx={2}
                            fill={s.color}
                          />
                        );
                      })}
                      <text x={left + band / 2} y={height - 4} textAnchor="middle">
                        {week.label.replace("Неделя ", "")}
                      </text>
                    </g>
                  );
                })}
                {point ? (
                  <foreignObject
                    x={tooltipX}
                    y={0}
                    width={TOOLTIP.width}
                    height={TOOLTIP.height}
                    overflow="visible"
                  >
                    <ChartFrame.Tooltip
                      label={point.label}
                      items={[
                        { id: "paid", value: point.paid },
                        { id: "pending", value: point.pending },
                      ]}
                    />
                  </foreignObject>
                ) : null}
              </svg>
            </div>
          );
        }}
      />
      <ChartFrame.Legend />
      <ChartFrame.Table
        rows={WEEKS.map((week) => ({
          label: week.label,
          values: { paid: week.paid, pending: week.pending },
        }))}
      />
    </ChartFrame.Root>
  );
}
