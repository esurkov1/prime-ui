import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

export default function DrawerControlledSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="previewRowWrap rowAlignCenter">
      <Button.Root variant="primary" onClick={() => setOpen(true)}>
        Открыть извне
      </Button.Root>
      <Button.Root mode="stroke" variant="neutral" onClick={() => setOpen(false)}>
        Закрыть извне
      </Button.Root>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Внешнее состояние"
        description="open / onOpenChange управляют открытием"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        side="right"
        footer={
          <Button.Root variant="primary" onClick={() => setOpen(false)}>
            Готово
          </Button.Root>
        }
      >
        <p>Компонент полностью контролируемый: состояние живёт в родителе.</p>
      </Drawer>
    </div>
  );
}
