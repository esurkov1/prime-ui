/** Invoices by week as grouped bars: the kit tooltip follows the pointer with a row per series, the arrows step through the weeks — `ChartFrame.Tooltip`, `items`, `point`. */
import { ChartFrame, type ChartFrameSeries, chartColors, VisuallyHidden } from "prime-ui-kit";
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

const formatCount = (value: number) => `${value} шт.`;

export default function ChartFrameTooltipExample() {
  const [active, setActive] = React.useState<number | null>(null);
  // The pointer in plot coordinates; `null` while the arrow keys step through the weeks.
  const [pointer, setPointer] = React.useState<{ x: number; y: number } | null>(null);

  return (
    <ChartFrame.Root
      series={SERIES}
      formatValue={formatCount}
      rows={WEEKS.map((week) => ({
        label: week.label,
        values: { paid: week.paid, pending: week.pending },
      }))}
    >
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
          // Beside the pointer; from the keyboard beside the middle of the active week.
          const tooltipAt =
            active === null
              ? null
              : (pointer ?? { x: MARGIN.left + band * active + band / 2, y: height / 2 });
          return (
            <div
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const index = Math.floor((event.clientX - rect.left - MARGIN.left) / band);
                setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                setActive(index >= 0 && index < WEEKS.length ? index : null);
              }}
              onPointerLeave={() => setActive(null)}
            >
              {/* The keyboard path: a native range steps through the weeks with the arrows; the
                  highlighted week and the tooltip show where it is. */}
              <VisuallyHidden>
                <input
                  type="range"
                  aria-label="Неделя"
                  min={0}
                  max={WEEKS.length - 1}
                  value={active ?? 0}
                  aria-valuetext={`${(point ?? WEEKS[0]).label}: оплачены ${(point ?? WEEKS[0]).paid}, ждут оплаты ${(point ?? WEEKS[0]).pending}`}
                  onChange={(event) => {
                    setPointer(null);
                    setActive(Number(event.target.value));
                  }}
                  onFocus={() => setActive((current) => current ?? 0)}
                  onBlur={() => setActive(null)}
                />
              </VisuallyHidden>
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
              </svg>
              <ChartFrame.Tooltip
                point={tooltipAt}
                label={point?.label}
                items={
                  point
                    ? [
                        { id: "paid", value: point.paid },
                        { id: "pending", value: point.pending },
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
