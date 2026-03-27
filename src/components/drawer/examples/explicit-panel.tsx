import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

import styles from "./examples-scenarios.module.css";

/**
 * Extended composition: `Drawer.Panel` exposes the shell explicitly; inner `Drawer.Content` is only the scroll region.
 */
export default function DrawerExampleExplicitPanel() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Open explicit panel
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Panel side="right" aria-labelledby="drawer-explicit-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-explicit-title">Details</Drawer.Title>
          </Drawer.Header>
          <Drawer.Content>
            <p className={styles.intro}>
              This body uses <code>Drawer.Content</code> inside <code>Drawer.Panel</code> so only
              this region scrolls when content overflows.
            </p>
          </Drawer.Content>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Close
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Panel>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
