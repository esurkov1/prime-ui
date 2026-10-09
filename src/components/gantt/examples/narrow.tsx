/** At 360 px the first column keeps only the avatars, the toolbar moves to its own row and the axis scrolls under the pinned column — `renderRowAvatar`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Avatar, Gantt, type GanttBar } from "prime-ui-kit";

import styles from "./examples.module.css";

type Courier = { id: string; name: string; initials: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const COURIERS: Courier[] = [
  {
    id: "orlov",
    name: "Денис Орлов",
    initials: "ДО",
    bars: [{ id: "o-1", label: "Центр", start: at(0), end: at(5), color: "blue" }],
  },
  {
    id: "lebedeva",
    name: "Мария Лебедева",
    initials: "МЛ",
    bars: [
      { id: "l-1", label: "Север", start: at(1), end: at(4), color: "green" },
      { id: "l-2", label: "Отпуск", start: at(7), end: at(14), color: "purple", readOnly: true },
    ],
  },
  {
    id: "zuev",
    name: "Антон Зуев",
    initials: "АЗ",
    bars: [{ id: "z-1", label: "Склад", start: at(2), end: at(9), color: "orange" }],
  },
];

export default function GanttNarrowExample() {
  return (
    <div className={styles.narrow}>
      <Gantt
        aria-label="Смены курьеров"
        defaultScale="day"
        rows={COURIERS}
        getRowKey={(courier) => courier.id}
        getRowLabel={(courier) => courier.name}
        getRowBars={(courier) => courier.bars}
        renderRowAvatar={(courier) => (
          <Avatar.Root color="sky">
            <Avatar.Fallback>{courier.initials}</Avatar.Fallback>
          </Avatar.Root>
        )}
      />
    </div>
  );
}
