/** One step for every KPI tile: the switcher above them sets it, each tile reads its latest period against the one before — `grain`, `aggregate`, `change`. */
import { Card, SegmentedControl, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Step = "day" | "week" | "month";

/** 91 days up to Thursday 22 October 2026. */
const daily = (base: number, swing: number): SparklinePoint[] =>
  Array.from({ length: 91 }, (_, i) => ({
    date: new Date(2026, 6, 24 + i),
    value: Math.round(base + swing * Math.sin(i / 4.3) + (swing / 3) * Math.sin(i / 1.6) + i / 6),
  }));

const LEADS = daily(60, 12);
const BOOKINGS = daily(26, 6);
const RETURNS = daily(14, 4);

export default function SparklineSharedGrainExample() {
  const [step, setStep] = React.useState<Step>("week");
  const shared = { grain: step, aggregate: "sum", change: "previous" } as const;
  const leads = useSparkline({ data: LEADS, ...shared });
  const bookings = useSparkline({ data: BOOKINGS, ...shared });
  const returns = useSparkline({ data: RETURNS, ...shared, better: "lower" });

  return (
    <>
      <SegmentedControl.Root
        value={step}
        onValueChange={(value) => setStep(value as Step)}
        aria-label="Шаг"
      >
        <SegmentedControl.Item value="day">Дни</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Недели</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяцы</SegmentedControl.Item>
      </SegmentedControl.Root>
      <div className={styles.tiles}>
        <Card.Root variant="stat-trend">
          <Card.Label>Лиды</Card.Label>
          <Card.Value>{leads.valueText}</Card.Value>
          {leads.changeText ? (
            <Card.Delta tone={leads.changeTone}>{leads.changeText}</Card.Delta>
          ) : null}
          <Sparkline {...leads.plot} label="Лиды" size="s" />
          <Card.Meta>{leads.date}</Card.Meta>
        </Card.Root>
        <Card.Root variant="stat-trend">
          <Card.Label>Брони</Card.Label>
          <Card.Value>{bookings.valueText}</Card.Value>
          {bookings.changeText ? (
            <Card.Delta tone={bookings.changeTone}>{bookings.changeText}</Card.Delta>
          ) : null}
          <Sparkline {...bookings.plot} label="Брони" size="s" />
          <Card.Meta>{bookings.date}</Card.Meta>
        </Card.Root>
        <Card.Root variant="stat-trend">
          <Card.Label>Возвраты</Card.Label>
          <Card.Value>{returns.valueText}</Card.Value>
          {returns.changeText ? (
            <Card.Delta tone={returns.changeTone}>{returns.changeText}</Card.Delta>
          ) : null}
          <Sparkline {...returns.plot} label="Возвраты" size="s" />
          <Card.Meta>{returns.date}</Card.Meta>
        </Card.Root>
      </div>
    </>
  );
}
