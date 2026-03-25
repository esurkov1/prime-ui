import { Button } from "@/components/button/Button";
import { Drawer, type DrawerSide } from "@/components/drawer/Drawer";

import styles from "./sizes.module.css";

const sides: DrawerSide[] = ["right", "left", "bottom", "top"];

function DrawerBySide({ side }: { side: DrawerSide }) {
  const label =
    side === "right"
      ? "Справа"
      : side === "left"
        ? "Слева"
        : side === "bottom"
          ? "Снизу"
          : "Сверху";

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          {label}
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side={side} aria-labelledby={`drawer-side-${side}-title`}>
          <Drawer.Header>
            <Drawer.Title id={`drawer-side-${side}-title`}>Сторона: {label}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              Проп <code>side</code> задаёт, от какого края экрана выезжает панель. У нижнего и
              верхнего листа высота ограничена (до 80vh), тело со скроллом при переполнении.
            </p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default function DrawerVariantsSidesSnippet() {
  return (
    <div className={styles.row}>
      {sides.map((side) => (
        <DrawerBySide key={side} side={side} />
      ))}
    </div>
  );
}
