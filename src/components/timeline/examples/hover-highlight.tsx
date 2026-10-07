/** Link rows highlighted only under the pointer or keyboard focus, with no persistent current row — `highlight`, `href`. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  { id: "rent-ivan", title: "Аренда закончилась · Иван К.", date: "21.09.26", value: "+6 300 ₽" },
  { id: "oil", title: "ТО: замена масла", date: "10.09.26", value: "−689 ₽" },
  { id: "wash", title: "Мойка и химчистка салона", date: "01.09.26", value: "−450 ₽" },
];

export default function TimelineHoverHighlightExample() {
  return (
    <Timeline.Root highlight="hover" className={styles.feed}>
      <Timeline.Group label="Операции">
        {EVENTS.map((event) => (
          <Timeline.Item key={event.id} href={`#${event.id}`}>
            <Timeline.Title>{event.title}</Timeline.Title>
            <Timeline.Meta>
              <Timeline.MetaPrimary>{event.date}</Timeline.MetaPrimary>
            </Timeline.Meta>
            <Timeline.Value>{event.value}</Timeline.Value>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}
