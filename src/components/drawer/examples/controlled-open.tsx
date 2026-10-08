/** The parent owns the state and opens the drawer from a link, without a trigger — `open`, `onOpenChange`. */
import { Button, Drawer, LinkButton, Typography } from "prime-ui-kit";
import * as React from "react";

export default function DrawerControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <LinkButton
        href="#help"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        Как формируется счёт?
      </LinkButton>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Content size="s">
          <Drawer.Header>
            <Drawer.Title>Счёт на оплату</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Typography variant="body-m" tone="secondary">
              Счёт формируется 1-го числа по тарифу и числу активных пользователей за прошлый месяц.
            </Typography>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="outline" tone="neutral">
                Закрыть
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
