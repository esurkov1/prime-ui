import { FileText, LayoutDashboard, Settings } from "lucide-react";
import { AppShell, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Primary app layout: `AppShell.Template` nav slot holds `Sidebar` with `sidebarSlot="page-nav"`.
 * `NavPanel` включает встроенную кнопку на грани (`data-placement="edge"`); режим — через `Sidebar.Root`.
 */
export default function SidebarExampleAppShellNav() {
  return (
    <div className={styles.demoViewport}>
      <AppShell.Template
        className={styles.appGrid}
        fillViewport={false}
        nav={
          <Sidebar.Root
            size="m"
            sidebarSlot="page-nav"
            responsive={false}
            defaultState="expanded"
            aria-label="Application"
          >
            <Sidebar.NavPanel>
              <Sidebar.Header>
                <Sidebar.HeaderRow>
                  <Sidebar.HeaderMain>
                    <Sidebar.IdentityButton
                      leading={<span aria-hidden="true">A</span>}
                      title="Acme Console"
                      subtitle="Production workspace"
                    />
                  </Sidebar.HeaderMain>
                </Sidebar.HeaderRow>
              </Sidebar.Header>
              <Sidebar.Content>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button" active>
                      <Sidebar.MenuIcon>
                        <LayoutDashboard size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Overview</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <FileText size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Reports</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <Settings size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Settings</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Content>
              <Sidebar.Footer>
                <Sidebar.IdentityButton
                  leading={<span aria-hidden="true">●</span>}
                  title="Signed in"
                  subtitle="user@acme.dev"
                />
              </Sidebar.Footer>
            </Sidebar.NavPanel>
          </Sidebar.Root>
        }
      >
        <Typography.Root
          as="p"
          variant="body-default"
          tone="muted"
          className={styles.mainPlaceholder}
        >
          Main scrolls inside <span className={styles.code}>AppShell.Main</span> (page gutters are
          on <span className={styles.code}>main</span>); the sidebar stays in the nav column. Use{" "}
          <span className={styles.code}>sidebarSlot=&quot;page-nav&quot;</span> so spacing and grid
          behavior match the app template.
        </Typography.Root>
      </AppShell.Template>
    </div>
  );
}
