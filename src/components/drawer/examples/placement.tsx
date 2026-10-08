/** The panel slides from the right for details, from the left for filters and up from the bottom as a sheet — `side`. */
import { Button, Drawer, Typography } from "prime-ui-kit";

const SIDES = [
  { side: "left", title: "Фильтры" },
  { side: "right", title: "Детали заказа" },
  { side: "bottom", title: "Действия с заказом" },
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
                Скругление только со стороны страницы, подложка затемняет остальное. Свайп к краю
                закрывает панель.
              </Typography>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </>
  );
}
