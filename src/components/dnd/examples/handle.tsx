/** Notification channels with the switch ending each row; a reorder mode swaps the switches for the grips, and only a grip starts a drag, the async save can roll the order back — `handle`, `Dnd.Handle`, `onReorder`, `fullWidth`. */
import { Button, Dnd, Icon, moveBefore, Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Channel = { id: string; title: string; enabled: boolean };

const CHANNELS: Channel[] = [
  { id: "email", title: "Почта", enabled: true },
  { id: "push", title: "Push-уведомления", enabled: true },
  { id: "slack", title: "Slack", enabled: false },
  { id: "sms", title: "SMS", enabled: false },
];

export default function DndHandleExample() {
  const [channels, setChannels] = React.useState(CHANNELS);
  const [reordering, setReordering] = React.useState(false);

  return (
    <>
      <Button.Root
        variant="soft"
        tone="neutral"
        onClick={() => setReordering((current) => !current)}
      >
        <Button.Icon>
          <Icon name={reordering ? "action.check" : "sort.none"} />
        </Button.Icon>
        {reordering ? "Готово" : "Изменить порядок"}
      </Button.Root>
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
            await new Promise((resolve) => setTimeout(resolve, 600));
            // The server refuses to put a switched-off channel first: the row glides back.
            const moved = channels.find((channel) => channel.id === id);
            if (moved && !moved.enabled && beforeId === channels[0]?.id) {
              throw new Error("Выключенный канал не может быть первым");
            }
            setChannels((current) => moveBefore(current, id, beforeId, (channel) => channel.id));
          }}
          renderItem={(channel) => (
            <Dnd.SortableItem id={channel.id} className={styles.handleRow}>
              {reordering ? (
                <>
                  <Typography as="span" variant="body-m" className={styles.rowText}>
                    {channel.title}
                  </Typography>
                  <Dnd.Handle />
                </>
              ) : (
                <Switch.Root
                  fullWidth
                  checked={channel.enabled}
                  onCheckedChange={(enabled) =>
                    setChannels((current) =>
                      current.map((item) => (item.id === channel.id ? { ...item, enabled } : item)),
                    )
                  }
                >
                  <Switch.Label>{channel.title}</Switch.Label>
                </Switch.Root>
              )}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    </>
  );
}
