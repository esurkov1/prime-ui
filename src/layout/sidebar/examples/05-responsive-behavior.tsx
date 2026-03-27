import { Inbox } from "lucide-react";
import { SIDEBAR_MEDIA_QUERY_NARROW, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Responsive mode (default `responsive={true}`): below the narrow breakpoint the panel becomes a drawer
 * with backdrop; the same edge toggle opens the panel when closed. Constants such as `SIDEBAR_MEDIA_QUERY_NARROW` match
 * the kit implementation (single source of truth for JS and CSS).
 */
export default function SidebarExampleResponsiveBehavior() {
  return (
    <div className={styles.demoViewportTall}>
      <Typography.Root as="p" variant="body-small" tone="muted" className={styles.note}>
        Narrow viewport matches <span className={styles.code}>{SIDEBAR_MEDIA_QUERY_NARROW}</span>{" "}
        (under <span className={styles.code}>48rem</span>). Resize the preview to see overlay
        behavior; at wider widths the rail stays inline and the built-in edge control cycles
        expanded and compact.
      </Typography.Root>
      <Sidebar.Root size="m" aria-label="Responsive sidebar">
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.IdentityButton
                  leading={<span aria-hidden="true">I</span>}
                  title="Inbox"
                  subtitle="Responsive"
                />
              </Sidebar.HeaderMain>
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuIcon>
                    <Inbox size={16} strokeWidth={1.9} />
                  </Sidebar.MenuIcon>
                  <Sidebar.MenuLabel>Primary</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.IdentityButton
              leading={<span aria-hidden="true">◇</span>}
              title="Status"
              subtitle="Adaptive layout"
            />
          </Sidebar.Footer>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
