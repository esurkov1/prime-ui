import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer, type DrawerSide } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./sizes.module.css";

const sides: DrawerSide[] = ["right", "left"];

function DrawerBySide({ side }: { side: DrawerSide }) {
  const [open, setOpen] = React.useState(false);
  const label = side === "right" ? "Справа" : "Слева";

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        {label}
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        title={`Сторона: ${label}`}
        description="slide-in/slide-out от выбранного края"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
      >
        <p>
          Проп <code>side</code> задаёт сторону выезда панели: left или right.
        </p>
      </Drawer>
    </>
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
