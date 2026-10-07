/** A long body that scrolls between the fixed header and footer. Use for logs, histories and long details. */
import { History } from "lucide-react";
import { Button, Drawer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  text: `${String(9 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")} — статус заказа обновлён`,
}));

export default function DrawerFeaturesExample() {
  return (
    <div className={styles.row}>
      <Drawer.Root>
        <Drawer.Trigger>
          <Button.Root variant="soft" tone="neutral">
            История изменений
          </Button.Root>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Icon>
              <History />
            </Drawer.Icon>
            <Drawer.Title>История изменений</Drawer.Title>
            <Drawer.Description>24 события за сегодня</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            {EVENTS.map((event) => (
              <Typography.Root key={event.id} variant="body-m" tone="secondary">
                {event.text}
              </Typography.Root>
            ))}
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="outline" tone="neutral">
                Закрыть
              </Button.Root>
            </Drawer.Close>
            <Button.Root>Экспорт</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
}
