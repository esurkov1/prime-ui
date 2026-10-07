/** Optional parts: an icon tile in the header and one full-width action in the footer — `Drawer.Icon`, `Drawer.Footer`, `layout`. */
import { Button, Drawer, Icon, Typography } from "prime-ui-kit";

export default function DrawerStructureExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Как считается выручка
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header>
          <Drawer.Icon tone="info">
            <Icon name="status.info" />
          </Drawer.Icon>
          <Drawer.Title>Выручка</Drawer.Title>
          <Drawer.Description>Справка по отчёту</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Typography variant="body-m" tone="secondary">
            В выручку входят оплаченные заказы за период без возвратов и отменённых доставок.
          </Typography>
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
  );
}
