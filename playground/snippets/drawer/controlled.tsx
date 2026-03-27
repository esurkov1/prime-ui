import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

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

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right" aria-labelledby="drawer-controlled-title">
            <Drawer.Header>
              <Drawer.Title id="drawer-controlled-title">Внешнее состояние</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Пара <code>open</code> и <code>onOpenChange</code> на <code>Drawer.Root</code>:{" "}
                <code>Drawer.Trigger</code> не обязателен.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root variant="primary">Готово</Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
