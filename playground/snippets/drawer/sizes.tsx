import { Button } from "@/components/button/Button";
import { Drawer, type DrawerSize } from "@/components/drawer/Drawer";

import styles from "./sizes.module.css";

function DrawerSizeDemo({ size }: { size: DrawerSize }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m">Open ({size})</Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content size={size} aria-labelledby={`drawer-sizes-title-${size}`}>
          <Drawer.Header>
            <Drawer.Title id={`drawer-sizes-title-${size}`}>Размер {size}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Отступы, заголовок и кнопка закрытия используют один ярус control {size}.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button.Root variant="neutral" mode="stroke">
              Вторичная
            </Button.Root>
            <Button.Root>Основная</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default function DrawerSizesSnippet() {
  return (
    <div className={styles.row}>
      <DrawerSizeDemo size="s" />
      <DrawerSizeDemo size="m" />
      <DrawerSizeDemo size="l" />
      <DrawerSizeDemo size="xl" />
    </div>
  );
}
