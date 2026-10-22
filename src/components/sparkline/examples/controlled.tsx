/** The KPI tiles of a dashboard follow one cursor: a scrub on any tile moves the point and the reading of all, no tooltip repeats the readings, and each tile opens its section — `point`, `onPointChange`, `size`. */
import { Card, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DAYS = ["1 окт", "2 окт", "3 окт", "4 окт", "5 окт", "6 окт", "7 окт", "8 окт"];

const byDay = (values: number[]): SparklinePoint[] =>
  values.map((value, i) => ({ label: DAYS[i], value }));

const LEADS = byDay([42, 51, 47, 58, 63, 55, 61, 70]);
const BOOKINGS = byDay([18, 22, 19, 25, 27, 24, 29, 31]);
const RENTALS = byDay([12, 15, 14, 17, 21, 19, 22, 24]);

export default function SparklineControlledExample() {
  const [point, setPoint] = React.useState<number | null>(null);
  const shared = { summary: "sum", point, onPointChange: setPoint } as const;
  const leads = useSparkline({ data: LEADS, ...shared });
  const bookings = useSparkline({ data: BOOKINGS, ...shared });
  const rentals = useSparkline({ data: RENTALS, ...shared });

  return (
    <div className={styles.tiles}>
      <Card.Root variant="stat-trend">
        <Card.Link href="#leads" aria-label="Лиды — открыть «Сделки»" />
        <Card.Label>Лиды</Card.Label>
        <Card.Value>{leads.valueText}</Card.Value>
        <Sparkline {...leads.plot} label="Лиды по дням" size="s" />
        <Card.Meta>{leads.date}</Card.Meta>
      </Card.Root>
      <Card.Root variant="stat-trend">
        <Card.Link href="#bookings" aria-label="Брони — открыть «Брони»" />
        <Card.Label>Брони</Card.Label>
        <Card.Value>{bookings.valueText}</Card.Value>
        <Sparkline {...bookings.plot} label="Брони по дням" size="s" />
        <Card.Meta>{bookings.date}</Card.Meta>
      </Card.Root>
      <Card.Root variant="stat-trend">
        <Card.Link href="#rentals" aria-label="Выдачи — открыть «Аренды»" />
        <Card.Label>Выдачи</Card.Label>
        <Card.Value>{rentals.valueText}</Card.Value>
        <Sparkline {...rentals.plot} label="Выдачи по дням" size="s" />
        <Card.Meta>{rentals.date}</Card.Meta>
      </Card.Root>
    </div>
  );
}
