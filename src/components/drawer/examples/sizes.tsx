/** Every panel width, 360 to 800 px; below 640 px of viewport the panel takes the full width — `size`. */
import { Button, Drawer, Typography } from "prime-ui-kit";

const SIZES = [
  { size: "s", width: "360 px" },
  { size: "m", width: "480 px" },
  { size: "l", width: "640 px" },
  { size: "xl", width: "800 px" },
] as const;

export default function DrawerSizesExample() {
  return (
    <>
      {SIZES.map(({ size, width }) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {size}
            </Button.Root>
          </Drawer.Trigger>
          <Drawer.Content size={size}>
            <Drawer.Header>
              <Drawer.Title>Детали заказа</Drawer.Title>
              <Drawer.Description>Ширина панели {width}</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Typography.Root variant="body-m" tone="secondary">
                На экране уже 640 px панель занимает всю ширину и теряет скругления.
              </Typography.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </>
  );
}
