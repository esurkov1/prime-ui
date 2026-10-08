/** At 375 px the title wraps and the amount stays right; below 20rem of its own width the amount moves under the meta line. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { id: "phone", className: styles.phone, label: "375 px" },
  { id: "narrow", className: styles.narrow, label: "280 px" },
];

const EVENTS = [
  { id: 1, title: "Аренда закончилась · Марина Л.", date: "17.07.26", value: "+9 450 ₽" },
  {
    id: 2,
    title: "ТО: замена масла и фильтров, проверка тормозов",
    date: "10.09.26",
    value: "−689 ₽",
  },
];

export default function TimelineNarrowExample() {
  return (
    <div className={styles.stack}>
      {WIDTHS.map((width) => (
        <Timeline.Root key={width.id} className={width.className}>
          <Timeline.Group label={width.label}>
            {EVENTS.map((event) => (
              <Timeline.Item key={event.id}>
                <Timeline.Title>{event.title}</Timeline.Title>
                <Timeline.Meta>
                  <Timeline.MetaPrimary>{event.date}</Timeline.MetaPrimary>
                </Timeline.Meta>
                <Timeline.Value>{event.value}</Timeline.Value>
              </Timeline.Item>
            ))}
          </Timeline.Group>
        </Timeline.Root>
      ))}
    </div>
  );
}
