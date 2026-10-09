/** Skeleton rows in the chart's geometry while it loads, an empty period and a plan you may only look at — `loading`, `empty`, `readOnly`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Gantt, type GanttBar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Vehicle = { id: string; name: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const FLEET: Vehicle[] = [
  {
    id: "a123",
    name: "ГАЗель А123ВС",
    bars: [{ id: "a-1", label: "Рейс Тверь", start: at(1), end: at(4), color: "blue" }],
  },
  {
    id: "k456",
    name: "КАМАЗ К456ОР",
    bars: [{ id: "k-1", label: "ТО", start: at(2), end: at(3), tone: "warning" }],
  },
];

const NO_VEHICLES: Vehicle[] = [];

const chartProps = {
  defaultScale: "day",
  getRowKey: (vehicle: Vehicle) => vehicle.id,
  getRowLabel: (vehicle: Vehicle) => vehicle.name,
  getRowBars: (vehicle: Vehicle) => vehicle.bars,
} as const;

export default function GanttStatesExample() {
  return (
    <div className={styles.specimens}>
      <div className={styles.specimen}>
        <Gantt aria-label="Загрузка машин" rows={NO_VEHICLES} loading {...chartProps} />
        <Typography as="span" variant="caption" tone="muted">
          loading
        </Typography>
      </div>
      <div className={styles.specimen}>
        <Gantt
          aria-label="Рейсы машин"
          rows={NO_VEHICLES}
          empty="На этой неделе рейсов нет"
          {...chartProps}
        />
        <Typography as="span" variant="caption" tone="muted">
          empty
        </Typography>
      </div>
      <div className={styles.specimen}>
        <Gantt
          aria-label="Рейсы машин, только просмотр"
          rows={FLEET}
          readOnly
          onBarChange={() => undefined}
          {...chartProps}
        />
        <Typography as="span" variant="caption" tone="muted">
          readOnly
        </Typography>
      </div>
    </div>
  );
}
