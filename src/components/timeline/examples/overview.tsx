/** An operations feed: one labelled group, a line through the dots, the row under the pointer highlighted — `Timeline.Group`, `Timeline.Value`. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  {
    id: 1,
    title: "Аренда закончилась · Иван К.",
    date: "21.09.26",
    ago: "15 д. назад",
    value: "+6 300 ₽",
  },
  { id: 2, title: "ТО: замена масла", date: "10.09.26", ago: "26 д. назад", value: "−689 ₽" },
  {
    id: 3,
    title: "Аренда закончилась · Сергей М.",
    date: "04.09.26",
    ago: "32 д. назад",
    value: "+13 500 ₽",
  },
  {
    id: 4,
    title: "Аренда закончилась · Амир Х.",
    date: "30.07.26",
    ago: "68 д. назад",
    value: "+5 400 ₽",
  },
];

export default function TimelineOverviewExample() {
  return (
    <Timeline.Root className={styles.feed}>
      <Timeline.Group label="Недавно">
        {EVENTS.map((event) => (
          <Timeline.Item key={event.id}>
            <Timeline.Title>{event.title}</Timeline.Title>
            <Timeline.Meta>
              <Timeline.MetaPrimary>{event.date}</Timeline.MetaPrimary> · {event.ago}
            </Timeline.Meta>
            <Timeline.Value>{event.value}</Timeline.Value>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}
