import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

/** Боковая панель ограничена по ширине (не шире 90vw). */
export default function DrawerResponsiveSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="ghost" onClick={() => setOpen(true)}>
        Как ведёт себя ширина
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Адаптив"
        description="Ширина: min(28rem, 90vw)"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
      >
        <p>На узком экране drawer сужается вместе с вьюпортом и сохраняет прокрутку внутри body.</p>
      </Drawer>
    </>
  );
}
