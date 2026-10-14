/** Loading, empty, error and data swap in the plot's place without moving the panel; the error retries, and the legend of the one series only names it — `state`, `onRetry`, `readOnly`. */
import {
  ChartFrame,
  type ChartFrameSeries,
  type ChartFrameState,
  chartColors,
  SegmentedControl,
} from "prime-ui-kit";
import * as React from "react";

const SERIES: ChartFrameSeries[] = [{ id: "orders", label: "Заказы" }];

const DAYS = [132, 158, 141, 176, 190, 164, 203, 188, 214, 197];

const formatOrders = (value: number) => value.toLocaleString("ru-RU");

export default function ChartFrameStatesExample() {
  const [state, setState] = React.useState<ChartFrameState>("loading");

  return (
    <>
      <SegmentedControl.Root
        aria-label="Состояние"
        value={state}
        onValueChange={(next) => setState(next as ChartFrameState)}
      >
        <SegmentedControl.Item value="loading">Загрузка</SegmentedControl.Item>
        <SegmentedControl.Item value="ready">Данные</SegmentedControl.Item>
        <SegmentedControl.Item value="empty">Пусто</SegmentedControl.Item>
        <SegmentedControl.Item value="error">Ошибка</SegmentedControl.Item>
      </SegmentedControl.Root>
      <ChartFrame.Root
        state={state}
        series={SERIES}
        formatValue={formatOrders}
        onRetry={() =>
          new Promise<void>((resolve) => {
            window.setTimeout(() => {
              setState("ready");
              resolve();
            }, 900);
          })
        }
      >
        <ChartFrame.Header>
          <ChartFrame.Title>Заказы за 10 дней</ChartFrame.Title>
        </ChartFrame.Header>
        <ChartFrame.Value>
          1 284
          <ChartFrame.Delta tone="success">+14%</ChartFrame.Delta>
        </ChartFrame.Value>
        <ChartFrame.Plot
          renderPlot={({ width, height, series }) => {
            const band = width / DAYS.length;
            const max = Math.max(...DAYS);
            return (
              <svg width={width} height={height} aria-hidden="true">
                <line x1={0} x2={width} y1={height} y2={height} stroke={chartColors.axis} />
                {DAYS.map((value, i) => (
                  <rect
                    // biome-ignore lint/suspicious/noArrayIndexKey: one bar per day, in order
                    key={i}
                    x={band * i + 4}
                    y={height - (height * value) / max}
                    width={band - 8}
                    height={(height * value) / max}
                    rx={2}
                    fill={series[0].color}
                  />
                ))}
              </svg>
            );
          }}
        />
        {/* One series: the legend only names it, there is nothing to turn off. */}
        <ChartFrame.Legend readOnly />
      </ChartFrame.Root>
    </>
  );
}
