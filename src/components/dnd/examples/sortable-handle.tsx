/** `handle`: only `Dnd.Handle` starts a drag, so rows keep working buttons, switches and text selection. The async `onReorder` may answer `{ ok: false }` to roll the drawn order back. Use for rows that carry their own controls. */
import { Card, Dnd, moveBefore, Switch, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

type Channel = { id: string; title: string; enabled: boolean };

const INITIAL: Channel[] = [
  { id: "email", title: "Почта", enabled: true },
  { id: "push", title: "Push-уведомления", enabled: true },
  { id: "telegram", title: "Telegram", enabled: false },
  { id: "sms", title: "SMS", enabled: false },
];

export default function DndSortableHandleExample() {
  const [channels, setChannels] = useState(INITIAL);

  return (
    <Dnd.Root>
      <Card.Root className={styles.card}>
        <Card.SectionHeader>
          <Card.SectionTitle>Каналы уведомлений</Card.SectionTitle>
        </Card.SectionHeader>
        <Card.Body>
          <Dnd.Sortable
            as="ul"
            handle
            aria-label="Каналы по приоритету"
            items={channels}
            getId={(channel) => channel.id}
            getLabel={(channel) => channel.title}
            onReorder={async (id, beforeId) => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              setChannels((current) => moveBefore(current, id, beforeId, (c) => c.id));
            }}
            renderItem={(channel) => (
              <Dnd.SortableItem id={channel.id} className={`${styles.row} ${styles.rowHandle}`}>
                <Dnd.Handle />
                <Typography.Root as="span" variant="body-m" className={styles.rowText}>
                  {channel.title}
                </Typography.Root>
                <Switch.Root
                  aria-label={channel.title}
                  checked={channel.enabled}
                  onCheckedChange={(enabled) =>
                    setChannels((current) =>
                      current.map((c) => (c.id === channel.id ? { ...c, enabled } : c)),
                    )
                  }
                />
              </Dnd.SortableItem>
            )}
          />
        </Card.Body>
      </Card.Root>
    </Dnd.Root>
  );
}
