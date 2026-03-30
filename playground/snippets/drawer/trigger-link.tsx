import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Icon } from "@/icons";

/**
 * Открытие Drawer из ссылки: управление состоянием на родителе.
 */
export default function DrawerTriggerLinkSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <LinkButton.Root
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Условия участия
      </LinkButton.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Краткие правила"
        description="Открытие идёт обычным onClick"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        footer={
          <Button.Root variant="primary" onClick={() => setOpen(false)}>
            Понятно
          </Button.Root>
        }
      >
        <p>
          В новой версии нет специального Trigger API. Любой контрол открывает панель через
          изменение <code>open</code>.
        </p>
      </Drawer>
    </>
  );
}
