/** Loading, data, empty and error in the plot's place at one panel size; the error retries, and the legend of the one series only names it — `state`, `onRetry`, `readOnly`. */
import {
  ChartFrame,
  type ChartFrameSeries,
  type ChartFrameState,
  chartColors,
  Typography,
} from "prime-ui-kit";

const SERIES: ChartFrameSeries[] = [{ id: "orders", label: "Заказы" }];

const STATES: ChartFrameState[] = ["loading", "ready", "empty", "error"];

const DAYS = [
  { day: "1 окт", orders: 132 },
  { day: "2 окт", orders: 158 },
  { day: "3 окт", orders: 141 },
  { day: "4 окт", orders: 176 },
  { day: "5 окт", orders: 190 },
  { day: "6 окт", orders: 164 },
  { day: "7 окт", orders: 203 },
  { day: "8 окт", orders: 188 },
  { day: "9 окт", orders: 214 },
  { day: "10 окт", orders: 197 },
];

const ROWS = DAYS.map(({ day, orders }) => ({ label: day, values: { orders } }));

const formatOrders = (value: number) => value.toLocaleString("ru-RU");

/** The request again: the retry button waits for it. */
const reload = () => new Promise<void>((resolve) => window.setTimeout(resolve, 900));

export default function ChartFrameStatesExample() {
  return (
    <div>
      {STATES.map((state) => (
        <div key={state}>
          <div>
            <ChartFrame.Root
              state={state}
              series={SERIES}
              rows={ROWS}
              formatValue={formatOrders}
              onRetry={reload}
            >
              <ChartFrame.Header>
                <ChartFrame.Title>Заказы за 10 дней</ChartFrame.Title>
              </ChartFrame.Header>
              <ChartFrame.Value>
                1 284
                <ChartFrame.Delta tone="success">+14%</ChartFrame.Delta>
              </ChartFrame.Value>
              <ChartFrame.Plot
                height={160}
                renderPlot={({ width, height, series }) => {
                  const band = width / DAYS.length;
                  const max = Math.max(...DAYS.map((d) => d.orders));
                  return (
                    <svg width={width} height={height} aria-hidden="true">
                      <line x1={0} x2={width} y1={height} y2={height} stroke={chartColors.axis} />
                      {DAYS.map(({ day, orders }, i) => (
                        <rect
                          key={day}
                          x={band * i + 4}
                          y={height - (height * orders) / max}
                          width={band - 8}
                          height={(height * orders) / max}
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
            <Typography as="span" variant="caption" tone="muted">
              {state}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
