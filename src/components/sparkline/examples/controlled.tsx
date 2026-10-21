/** The KPI tiles of a dashboard follow one cursor: a scrub on any tile moves the point and the headline of all, the tooltip stays with the tile under the pointer, and each tile opens its section — `point`, `onPointChange`, `size`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DAYS = ["1 окт", "2 окт", "3 окт", "4 окт", "5 окт", "6 окт", "7 окт", "8 окт"];

const series = (values: number[]): SparklinePoint[] =>
  values.map((value, i) => ({ label: DAYS[i], value }));

const TILES = [
  {
    label: "Лиды",
    href: "#leads",
    section: "Сделки",
    data: series([42, 51, 47, 58, 63, 55, 61, 70]),
  },
  {
    label: "Брони",
    href: "#bookings",
    section: "Брони",
    data: series([18, 22, 19, 25, 27, 24, 29, 31]),
  },
  {
    label: "Выдачи",
    href: "#rentals",
    section: "Аренды",
    data: series([12, 15, 14, 17, 21, 19, 22, 24]),
  },
  {
    label: "Возвраты",
    href: "#returns",
    section: "Аренды",
    data: series([9, 11, 13, 12, 15, 18, 16, 19]),
  },
];

export default function SparklineControlledExample() {
  const [point, setPoint] = React.useState<number | null>(null);

  return (
    <div className={styles.tiles}>
      {TILES.map((tile) => (
        <Card.Root key={tile.label}>
          <Card.Link href={tile.href} aria-label={`${tile.label} — открыть «${tile.section}»`} />
          <Card.Body>
            <Sparkline
              data={tile.data}
              label={tile.label}
              summary="sum"
              size="s"
              point={point}
              onPointChange={setPoint}
            />
          </Card.Body>
        </Card.Root>
      ))}
    </div>
  );
}
