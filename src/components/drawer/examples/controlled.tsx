/** Controlled drawer opened from a link: `open` + `onOpenChange` on Drawer.Root, a custom close label and `layout="fill"` in the footer. Use when any element, not a trigger, opens the panel. */
import { Button, Drawer, LinkButton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DrawerControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.row}>
      <LinkButton.Root
        href="#help"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        Как это работает?
      </LinkButton.Root>
      <Drawer.Root open={open} onOpenChange={setOpen} labels={{ close: "Закрыть справку" }}>
        <Drawer.Content size="s">
          <Drawer.Header>
            <Drawer.Title>Справка</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Typography.Root variant="body-m" tone="secondary">
              Состояние хранит родитель: open и onOpenChange на Drawer.Root, триггер не нужен.
            </Typography.Root>
          </Drawer.Body>
          <Drawer.Footer layout="fill">
            <Drawer.Close>
              <Button.Root variant="outline" tone="neutral">
                Понятно
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
}
