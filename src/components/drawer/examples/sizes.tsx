/** Drawer.Content widths s · m · l · xl. Below 640px of viewport the panel always takes the full width. */
import { Button, Drawer, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = [
  { size: "s", width: "360 px" },
  { size: "m", width: "480 px" },
  { size: "l", width: "640 px" },
  { size: "xl", width: "800 px" },
] as const;

export default function DrawerSizesExample() {
  return (
    <div className={styles.row}>
      {SIZES.map(({ size, width }) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Размер {size}
            </Button.Root>
          </Drawer.Trigger>
          <Drawer.Content size={size}>
            <Drawer.Header>
              <Drawer.Title>Панель размера {size}</Drawer.Title>
              <Drawer.Description>Ширина {width}</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Typography.Root variant="body-m" tone="secondary">
                Ширина берётся из{" "}
                <Typography.Root as="span" variant="code" tone="secondary">
                  --prime-drawer-width-{size}
                </Typography.Root>
                . На экране уже 640 px панель занимает всю ширину и теряет скругления.
              </Typography.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </div>
  );
}
