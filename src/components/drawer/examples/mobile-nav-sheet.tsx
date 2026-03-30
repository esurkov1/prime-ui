import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./examples-scenarios.module.css";

const items = ["Home", "Catalog", "Orders", "Account"] as const;

/**
 * Mobile navigation surface with explicit close on item selection.
 */
export default function DrawerExampleMobileNavSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Menu
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="left"
        title="Navigate"
        description="Primary sections"
        icon={<Icon name="nav.home" tone="subtle" />}
      >
        <nav className={styles.nav} aria-label="Primary">
          {items.map((label) => (
            <Button.Root
              key={label}
              type="button"
              variant="neutral"
              mode="ghost"
              fullWidth
              onClick={() => setOpen(false)}
            >
              {label}
            </Button.Root>
          ))}
        </nav>
        <p className={styles.muted}>In a real app, wire each action to routing and state sync.</p>
      </Drawer>
    </>
  );
}
