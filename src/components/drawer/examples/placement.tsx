/** The panel slides from the right for details and from the left for filters, rounded only on the edge facing the page — `side`. */
import { Button, Drawer, Typography } from "prime-ui-kit";

const SIDES = [
  { side: "left", title: "Фильтры" },
  { side: "right", title: "Детали заказа" },
] as const;

export default function DrawerPlacementExample() {
  return (
    <div>
      {SIDES.map(({ side, title }) => (
        <div key={side}>
          <Drawer.Root>
            <Drawer.Trigger>
              <Button.Root variant="soft" tone="neutral">
                {title}
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
              <Drawer.Footer>
                <Drawer.Close>
                  <Button.Root variant="outline" tone="neutral">
                    Закрыть
                  </Button.Root>
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
          <Typography as="span" variant="caption" tone="muted">
            {side}
          </Typography>
        </div>
      ))}
    </div>
  );
}
