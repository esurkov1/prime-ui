/** `flush`: no inner padding and no gap, so rows reach the panel edges and Dividers run edge to edge. Each row lays out its own padding; controls inside keep a focus-space inset. Use for notification lists and filter panels made of full-width rows. */
import { Button, Divider, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const EVENTS = [
  { id: "1", title: "Счёт № 4821 оплачен", time: "12:04" },
  { id: "2", title: "Новый отзыв на «Планшет Pro»", time: "11:47" },
  { id: "3", title: "Синхронизация складов завершена", time: "10:30" },
];

export default function PopoverFlushListExample() {
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
          <Button.Root variant="ghost" tone="neutral" size="s">
            Прочитать все
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
