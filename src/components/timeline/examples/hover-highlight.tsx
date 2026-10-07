/** `highlight="hover"`: no persistent selection, the row under the pointer or with keyboard focus gets the pill, accent title and dot; rows are links via `href`. Use for feeds where each row opens a page. */

import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const events = [
  {
    id: "rent-ivan",
    title: "Аренда закончилась · Иван К.",
    date: "21.09.26",
    ago: "15 д. назад",
    value: "+6 300 ฿",
  },
  { id: "oil", title: "ТО: замена масла", date: "10.09.26", ago: "26 д. назад", value: "−689 ฿" },
  {
    id: "rent-sergey",
    title: "Аренда закончилась · Сергей М.",
    date: "04.09.26",
    ago: "32 д. назад",
    value: "+13 500 ฿",
  },
  {
    id: "wash",
    title: "Мойка и химчистка салона",
    date: "01.09.26",
    ago: "36 д. назад",
    value: "−450 ฿",
  },
];

export default function TimelineHoverHighlightExample() {
  return (
    <Timeline.Root highlight="hover" className={styles.feed}>
      <Timeline.Group label="Операции">
        {events.map((event) => (
          <Timeline.Item key={event.id} href={`#${event.id}`}>
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
