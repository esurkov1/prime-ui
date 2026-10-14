/** Revenue by month per client in a list: the plot alone at a row's height with the dot on the current month, the label is the chart's accessible name — `layout`, `label`. */
import { Card, Sparkline, type SparklinePoint, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const MONTHS = ["май", "июн", "июл", "авг", "сен", "окт"];

const CLIENTS = [
  { name: "ООО «Северный ветер»", revenue: [184, 196, 172, 210, 238, 251] },
  { name: "АО «Технопарк»", revenue: [612, 580, 545, 498, 470, 455] },
  { name: "ИП Козлов", revenue: [28, 31, 27, 35, 33, 41] },
];

const series = (revenue: number[]): SparklinePoint[] =>
  revenue.map((value, i) => ({ label: MONTHS[i] ?? "", value: value * 1000 }));

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineCompactExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <div className={styles.list}>
          {CLIENTS.map((client) => (
            <div key={client.name} className={styles.listRow}>
              <Typography as="span" variant="body-s">
                {client.name}
              </Typography>
              <Sparkline
                layout="compact"
                data={series(client.revenue)}
                label={`Выручка по месяцам, ${client.name}`}
                formatValue={formatRubles}
              />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card.Root>
  );
}
