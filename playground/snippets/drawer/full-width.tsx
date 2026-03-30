import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./full-width.module.css";

/** В подвале колонка кнопок на всю ширину панели — удобно на узком drawer. */
export default function DrawerFullWidthSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Действия на всю ширину
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Подтвердите выбор"
        description="Футер можно сделать вертикальным"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        footer={
          <div className={styles.footerStack}>
            <Button.Root variant="primary" fullWidth onClick={() => setOpen(false)}>
              Сохранить и применить
            </Button.Root>
            <Button.Root variant="neutral" mode="stroke" fullWidth onClick={() => setOpen(false)}>
              Вернуться
            </Button.Root>
          </div>
        }
      >
        <p className={styles.intro}>
          Ниже — вертикальный стек с <code>fullWidth</code> у кнопок.
        </p>
      </Drawer>
    </>
  );
}
