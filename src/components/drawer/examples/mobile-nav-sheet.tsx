import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

import styles from "./examples-scenarios.module.css";

const items = ["Home", "Catalog", "Orders", "Account"] as const;

/**
 * Bottom sheet pattern for small-viewport primary navigation. Wrap rows in `Drawer.Close` so choosing a section dismisses the sheet.
 */
export default function DrawerExampleMobileNavSheet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Menu
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="bottom" aria-labelledby="drawer-nav-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-nav-title">Navigate</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <nav className={styles.nav} aria-label="Primary">
              {items.map((label) => (
                <Drawer.Close key={label}>
                  <Button.Root type="button" variant="neutral" mode="ghost" fullWidth>
                    {label}
                  </Button.Root>
                </Drawer.Close>
              ))}
            </nav>
            <p className={styles.muted}>
              In a real app, wire each action to routing and close from `onOpenChange` if needed.
            </p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
