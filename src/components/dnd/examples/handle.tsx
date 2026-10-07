/** Notification channels with switches: only the grip starts a drag, and the async save can roll the order back — `handle`, `Dnd.Handle`, `onReorder`. */
import { Dnd, moveBefore, Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Channel = { id: string; title: string; enabled: boolean };

const CHANNELS: Channel[] = [
  { id: "email", title: "Почта", enabled: true },
  { id: "push", title: "Push-уведомления", enabled: true },
  { id: "telegram", title: "Telegram", enabled: false },
  { id: "sms", title: "SMS", enabled: false },
];

export default function DndHandleExample() {
  const [channels, setChannels] = React.useState(CHANNELS);

  return (
    <Dnd.Root>
      <Dnd.Sortable
        as="ul"
        handle
        aria-label="Каналы по приоритету"
        className={styles.list}
        items={channels}
        getId={(channel) => channel.id}
        getLabel={(channel) => channel.title}
        onReorder={async (id, beforeId) => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setChannels((current) => moveBefore(current, id, beforeId, (channel) => channel.id));
        }}
        renderItem={(channel) => (
          <Dnd.SortableItem id={channel.id} className={styles.handleRow}>
            <Dnd.Handle />
            <Typography.Root as="span" variant="body-m" className={styles.rowText}>
              {channel.title}
            </Typography.Root>
            <Switch.Root
              aria-label={channel.title}
              checked={channel.enabled}
              onCheckedChange={(enabled) =>
                setChannels((current) =>
                  current.map((item) => (item.id === channel.id ? { ...item, enabled } : item)),
                )
              }
            />
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}
