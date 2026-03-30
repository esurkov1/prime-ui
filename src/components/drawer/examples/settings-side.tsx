import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

import styles from "./examples-scenarios.module.css";

/**
 * Settings on the trailing edge: form fields live in the scroll body, actions are fixed in footer.
 */
export default function DrawerExampleSettingsSide() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Workspace settings
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Workspace"
        description="Team defaults and scheduling options"
        icon={<Icon name="nav.layoutGrid" tone="subtle" />}
        side="right"
        footer={
          <div className={styles.footerActions}>
            <Button.Root
              type="button"
              variant="neutral"
              mode="stroke"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root type="button" variant="primary" onClick={() => setOpen(false)}>
              Save changes
            </Button.Root>
          </div>
        }
      >
        <div className={styles.settingsStack}>
          <Input.Root label="Workspace name">
            <Input.Wrapper>
              <Input.Field defaultValue="Acme Design" />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root label="Default timezone" hint="Used for scheduled reports.">
            <Input.Wrapper>
              <Input.Field defaultValue="Europe/Berlin" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </Drawer>
    </>
  );
}
