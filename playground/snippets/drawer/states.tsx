import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./sizes.module.css";

function BasicStateDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Базовое состояние
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Закрытие по overlay и Escape"
        description="Поведение встроено в компонент"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        footer={
          <Button.Root variant="primary" onClick={() => setOpen(false)}>
            Закрыть
          </Button.Root>
        }
      >
        <p>Drawer закрывается по Esc, клику по подложке и кнопке в шапке.</p>
      </Drawer>
    </>
  );
}

function FooterlessStateDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Без footer
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Минимальный сценарий"
        description="Только контент и системная кнопка закрытия"
        icon={<Icon name="nav.home" tone="subtle" />}
      >
        <p>Если не передать footer, панель рендерится без нижней зоны действий.</p>
      </Drawer>
    </>
  );
}

export default function DrawerStatesSnippet() {
  return (
    <div className={styles.row}>
      <BasicStateDrawer />
      <FooterlessStateDrawer />
    </div>
  );
}
