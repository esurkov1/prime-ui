import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./examples-scenarios.module.css";

/**
 * Canonical new API with icon + subtitle in header and actions in footer.
 */
export default function DrawerExampleExplicitPanel() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Open details
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Details"
        description="Only body scrolls when content overflows"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        side="right"
        footer={
          <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(false)}>
            Close
          </Button.Root>
        }
      >
        <p className={styles.intro}>
          This drawer uses the new single-component API: header with icon/title/description,
          scrollable content area, and footer actions.
        </p>
      </Drawer>
    </>
  );
}
