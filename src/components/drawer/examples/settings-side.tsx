import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Input } from "@/components/input/Input";

import styles from "./examples-scenarios.module.css";

/**
 * Settings on the trailing edge: form fields share the drawer `size` tier with header and footer controls.
 */
export default function DrawerExampleSettingsSide() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Workspace settings
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-settings-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-settings-title">Workspace</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
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
          </Drawer.Body>
          <Drawer.Footer className={styles.footerActions}>
            <Drawer.Close>
              <Button.Root type="button" variant="neutral" mode="stroke">
                Cancel
              </Button.Root>
            </Drawer.Close>
            <Drawer.Close>
              <Button.Root type="button" variant="primary">
                Save changes
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
