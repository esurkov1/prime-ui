/** A year of daily revenue with a step switcher the card lays out from the reading: the current period is cut at today, hatched, and compared with the same days of the one before — `grains`, `setGrain`, `change`. */
import {
  Button,
  Dropdown,
  Icon,
  Kpi,
  Sparkline,
  type SparklinePoint,
  useSparkline,
} from "prime-ui-kit";

import styles from "./examples.module.css";

/** Daily revenue, 23 October 2025 — 22 October 2026. */
const REVENUE: SparklinePoint[] = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2025, 9, 23 + i),
  value: Math.round(240 + 50 * Math.sin(i / 29) + 30 * Math.sin(i / 3.5) + i * 0.3) * 1000,
}));

const STEPS = { day: "По дням", week: "По неделям", month: "По месяцам", quarter: "По кварталам" };

const THOUSANDS = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** An M card writes a sum short: thousands, the unit stands in `Kpi.Unit`. */
const formatThousands = (value: number) => THOUSANDS.format(value / 1000);

export default function SparklineGrainExample() {
  const revenue = useSparkline({
    data: REVENUE,
    defaultGrain: "month",
    aggregate: "sum",
    change: "previous",
    formatValue: formatThousands,
  });
  // A year by days is 365 points: the switcher offers the steps a tile can show.
  const steps = revenue.grains.filter((step) => step !== "day");

  return (
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Выручка</Kpi.Title>
      <Kpi.Actions>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" aria-label={`Шаг: ${STEPS[revenue.grain]}`}>
              {STEPS[revenue.grain]}
              <Button.Icon>
                <Icon name="nav.chevronDown" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content side="bottom" align="end">
            {steps.map((step) => (
              <Dropdown.Item
                key={step}
                selected={step === revenue.grain}
                onSelect={() => revenue.setGrain(step)}
              >
                {STEPS[step]}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </Kpi.Actions>
      <Kpi.Value>
        {revenue.valueText}
        <Kpi.Unit>тыс. ₽</Kpi.Unit>
      </Kpi.Value>
      <Kpi.Delta reading={revenue} />
      <Kpi.Period>{revenue.date}</Kpi.Period>
      <Kpi.Media>
        <Sparkline {...revenue.plot} label="Выручка по периодам" variant="bars" />
      </Kpi.Media>
    </Kpi.Root>
  );
}
