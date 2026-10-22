/** The KPI tiles of a dashboard follow one cursor: a scrub on any tile moves the point and the reading of all, no tooltip repeats the readings, and each tile opens its section — `point`, `onPointChange`, `size`. */
import { Card, Kpi, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DAYS = ["1 окт", "2 окт", "3 окт", "4 окт", "5 окт", "6 окт", "7 окт", "8 окт"];

const byDay = (values: number[]): SparklinePoint[] =>
  values.map((value, i) => ({ label: DAYS[i], value }));

const LEADS = byDay([42, 51, 47, 58, 63, 55, 61, 70]);
const BOOKINGS = byDay([18, 22, 19, 25, 27, 24, 29, 31]);

export default function SparklineControlledExample() {
  const [point, setPoint] = React.useState<number | null>(null);
  const shared = { summary: "sum", point, onPointChange: setPoint } as const;
  const leads = useSparkline({ data: LEADS, ...shared });
  const bookings = useSparkline({ data: BOOKINGS, ...shared });

  return (
    <div className={styles.tiles}>
      <Kpi.Root>
        <Kpi.Title>
          <Card.Link href="#leads">Лиды</Card.Link>
        </Kpi.Title>
        <Kpi.Period>{leads.date}</Kpi.Period>
        <Kpi.Value>{leads.valueText}</Kpi.Value>
        <Kpi.Media>
          <Sparkline {...leads.plot} label="Лиды по дням" size="s" />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>
          <Card.Link href="#bookings">Брони</Card.Link>
        </Kpi.Title>
        <Kpi.Period>{bookings.date}</Kpi.Period>
        <Kpi.Value>{bookings.valueText}</Kpi.Value>
        <Kpi.Media>
          <Sparkline {...bookings.plot} label="Брони по дням" size="s" />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
