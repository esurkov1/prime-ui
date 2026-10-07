/** The panel slides from the right for details and from the left for filters — `side`. */
import { Button, Drawer, Typography } from "prime-ui-kit";

const SIDES = [
  { side: "left", title: "Фильтры" },
  { side: "right", title: "Детали заказа" },
] as const;

export default function DrawerPlacementExample() {
  return (
    <>
      {SIDES.map(({ side, title }) => (
        <Drawer.Root key={side}>
          <Drawer.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {side}
            </Button.Root>
          </Drawer.Trigger>
          <Drawer.Content side={side} size="s">
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Typography variant="body-m" tone="secondary">
                Скругление только со стороны страницы, подложка затемняет остальное.
              </Typography>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </>
  );
}
