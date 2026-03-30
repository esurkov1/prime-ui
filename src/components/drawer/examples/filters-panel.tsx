import * as React from "react";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./examples-scenarios.module.css";

/**
 * Filter drawer from the leading edge; footer keeps Apply / Reset visible while criteria scroll.
 */
export default function DrawerExampleFiltersPanel() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Filters
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="left"
        title="Filters"
        description="Choose product visibility constraints"
        icon={<Icon name="nav.itemDot" tone="subtle" />}
        footer={
          <div className={styles.footerActions}>
            <Button.Root
              type="button"
              variant="neutral"
              mode="stroke"
              onClick={() => setOpen(false)}
            >
              Reset
            </Button.Root>
            <Button.Root type="button" variant="primary" onClick={() => setOpen(false)}>
              Apply
            </Button.Root>
          </div>
        }
      >
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
      </Drawer>
    </>
  );
}
