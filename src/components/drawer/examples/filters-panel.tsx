import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Drawer } from "@/components/drawer/Drawer";

import styles from "./examples-scenarios.module.css";

/**
 * Filter drawer from the leading edge; footer keeps Apply / Reset visible while criteria scroll.
 */
export default function DrawerExampleFiltersPanel() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Filters
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="left" aria-labelledby="drawer-filters-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-filters-title">Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div className={styles.filterStack}>
              <Checkbox.Root defaultChecked>
                <Checkbox.Label>In stock only</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root>
                <Checkbox.Label>On sale</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root>
                <Checkbox.Label>Ships today</Checkbox.Label>
              </Checkbox.Root>
            </div>
          </Drawer.Body>
          <Drawer.Footer className={styles.footerActions}>
            <Drawer.Close>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Reset
              </Button.Root>
            </Drawer.Close>
            <Drawer.Close>
              <Button.Root type="button" variant="primary">
                Apply
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
