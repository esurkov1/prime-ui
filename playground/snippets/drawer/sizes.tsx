import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer, type DrawerSide } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./sizes.module.css";

function DrawerSideDemo({ side }: { side: DrawerSide }) {
  const [open, setOpen] = React.useState(false);
  const label = side === "left" ? "Слева" : "Справа";

  return (
    <>
      <Button.Root size="m" onClick={() => setOpen(true)}>
        Open ({label})
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        title={`Панель ${label.toLowerCase()}`}
        description="Единый layout шапки, body и footer"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        footer={
          <>
            <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(false)}>
              Вторичная
            </Button.Root>
            <Button.Root onClick={() => setOpen(false)}>Основная</Button.Root>
          </>
        }
      >
        <p>Содержимое в ScrollContainer. Анимация закрытия проигрывается перед размонтированием.</p>
      </Drawer>
    </>
  );
}

export default function DrawerSizesSnippet() {
  return (
    <div className={styles.row}>
      <DrawerSideDemo side="left" />
      <DrawerSideDemo side="right" />
    </div>
  );
}
