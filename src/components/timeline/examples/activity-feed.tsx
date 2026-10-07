/** Activity feed: a «Недавно» group, the line joins the first and last dots, the `active` row gets the pill with accent title and dot. Use for operation histories with amounts. */

import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const events = [
  {
    id: 1,
    title: "Аренда закончилась · Иван К.",
    date: "21.09.26",
    ago: "15 д. назад",
    value: "+6 300 ฿",
  },
  { id: 2, title: "ТО: замена масла", date: "10.09.26", ago: "26 д. назад", value: "−689 ฿" },
  {
    id: 3,
    title: "Аренда закончилась · Сергей М.",
    date: "04.09.26",
    ago: "32 д. назад",
    value: "+13 500 ฿",
  },
  {
    id: 4,
    title: "Аренда закончилась · Амир Х.",
    date: "30.07.26",
    ago: "68 д. назад",
    value: "+5 400 ฿",
  },
  {
    id: 5,
    title: "Аренда закончилась · Марина Л.",
    date: "17.07.26",
    ago: "81 д. назад",
    value: "+9 450 ฿",
  },
];

export default function TimelineActivityFeedExample() {
  return (
    <Timeline.Root className={styles.feed}>
      <Timeline.Group label="Недавно">
        {events.map((event) => (
          <Timeline.Item key={event.id} active={event.id === 2}>
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
