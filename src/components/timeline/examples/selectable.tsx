/** Rows with `onClick` become buttons (one Tab stop each, `fill-subtle` hover, inset focus ring); the `active` row keeps the highlight; `tone` colors the dot and the amount. Use when a row selects a detail view. */

import { Timeline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const events = [
  {
    id: "rent-ivan",
    title: "Аренда закончилась · Иван К.",
    date: "21.09.26",
    ago: "15 д. назад",
    value: "+6 300 ฿",
    tone: "success" as const,
  },
  {
    id: "oil",
    title: "ТО: замена масла",
    date: "10.09.26",
    ago: "26 д. назад",
    value: "−689 ฿",
    tone: "danger" as const,
  },
  {
    id: "rent-sergey",
    title: "Аренда закончилась · Сергей М.",
    date: "04.09.26",
    ago: "32 д. назад",
    value: "+13 500 ฿",
    tone: "success" as const,
  },
];

export default function TimelineSelectableExample() {
  const [selected, setSelected] = React.useState("oil");

  return (
    <Timeline.Root highlight="selected" className={styles.feed}>
      <Timeline.Group label="Операции">
        {events.map((event) => (
          <Timeline.Item
            key={event.id}
            tone={event.tone}
            active={selected === event.id}
            onClick={() => setSelected(event.id)}
          >
            <Timeline.Title>{event.title}</Timeline.Title>
            <Timeline.Meta>
              <strong>{event.date}</strong> · {event.ago}
            </Timeline.Meta>
            <Timeline.Value tone={event.tone}>{event.value}</Timeline.Value>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}
