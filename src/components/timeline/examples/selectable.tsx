/** Rows with a click handler become buttons that open a detail view; the open row stays current — `onClick`, `current`. */
import { Timeline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const EVENTS = [
  {
    id: "rent-ivan",
    title: "Аренда закончилась · Иван К.",
    date: "21.09.26",
    value: "+6 300 ₽",
    tone: "success",
  },
  { id: "oil", title: "ТО: замена масла", date: "10.09.26", value: "−689 ₽", tone: "danger" },
  {
    id: "rent-sergey",
    title: "Аренда закончилась · Сергей М.",
    date: "04.09.26",
    value: "+13 500 ₽",
    tone: "success",
  },
] as const;

export default function TimelineSelectableExample() {
  const [openId, setOpenId] = React.useState("oil");

  return (
    <Timeline.Root className={styles.feed}>
      <Timeline.Group label="Операции">
        {EVENTS.map((event) => (
          <Timeline.Item
            key={event.id}
            tone={event.tone}
            current={openId === event.id}
            onClick={() => setOpenId(event.id)}
          >
            <Timeline.Title>{event.title}</Timeline.Title>
            <Timeline.Meta>
              <Timeline.MetaPrimary>{event.date}</Timeline.MetaPrimary>
            </Timeline.Meta>
            <Timeline.Value tone={event.tone}>{event.value}</Timeline.Value>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}
