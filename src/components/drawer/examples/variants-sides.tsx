/** `side="left"` and `side="right"`: right (default) for details and forms, left for filters and navigation. */
import { Button, Drawer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIDES = [
  { side: "left", label: "Слева", title: "Фильтры" },
  { side: "right", label: "Справа", title: "Детали заказа" },
] as const;

export default function DrawerVariantsSidesExample() {
  return (
    <div className={styles.row}>
      {SIDES.map(({ side, label, title }) => (
        <Drawer.Root key={side}>
          <Drawer.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {label}
            </Button.Root>
          </Drawer.Trigger>
          <Drawer.Content side={side} size="s">
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
              <Drawer.Description>side="{side}"</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Typography.Root variant="body-m" tone="secondary">
                Скругление только со стороны страницы, подложка затемняет остальное.
              </Typography.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </div>
  );
}
