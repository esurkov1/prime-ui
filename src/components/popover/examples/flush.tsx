/** A notification list whose rows and dividers reach the panel edges; each row brings its own padding — `flush`. */
import { Button, Divider, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const EVENTS = [
  { id: "paid", title: "Счёт № 4821 оплачен", time: "12:04" },
  { id: "review", title: "Новый отзыв на «Планшет Pro»", time: "11:47" },
  { id: "sync", title: "Синхронизация складов завершена", time: "10:30" },
];

export default function PopoverFlushExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Уведомления
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content flush className={styles.flushPanel}>
        <Popover.Title className={styles.flushHead}>Уведомления</Popover.Title>
        {EVENTS.map((event) => (
          <React.Fragment key={event.id}>
            <Divider.Root role="presentation" />
            <div className={styles.flushRow}>
              <Typography.Root as="span" variant="body-m">
                {event.title}
              </Typography.Root>
              <Typography.Root as="span" variant="caption" tone="muted">
                {event.time}
              </Typography.Root>
            </div>
          </React.Fragment>
        ))}
        <Divider.Root role="presentation" />
        <div className={styles.flushFooter}>
          <Popover.Close>
            <Button.Root variant="ghost" tone="neutral" size="s">
              Прочитать все
            </Button.Root>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
