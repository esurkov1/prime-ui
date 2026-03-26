import { Inbox, Layers } from "lucide-react";
import { Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Desktop collapse: `ToggleButton` cycles expanded → compact → expanded (not the mobile overlay).
 * With `responsive={false}`, narrow viewports keep the inline rail instead of the drawer pattern.
 */
export default function SidebarExampleCollapsibleDesktop() {
  return (
    <div className={styles.demoViewport}>
      <Sidebar.Root
        size="m"
        responsive={false}
        defaultState="expanded"
        aria-label="Collapsible navigation"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.Text>Workspace</Sidebar.Text>
              </Sidebar.HeaderMain>
              <Sidebar.ToggleButton />
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.NavPanelBody>
              <Typography.Root
                as="p"
                variant="body-small"
                tone="muted"
                className={styles.mainPlaceholder}
              >
                Use the header control to switch width. In{" "}
                <span className={styles.code}>compact</span>, menu rows show icons; tooltips appear
                on the right for icon-only targets (desktop only).
              </Typography.Root>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton type="button" active tooltip="Inbox">
                    <Sidebar.MenuIcon>
                      <Inbox size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Inbox</Sidebar.MenuLabel>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton type="button" tooltip="Projects">
                    <Sidebar.MenuIcon>
                      <Layers size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Projects</Sidebar.MenuLabel>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.NavPanelBody>
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
