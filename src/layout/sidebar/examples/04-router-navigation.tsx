import { Home, Settings } from "lucide-react";
import { Sidebar, Typography } from "prime-ui-kit";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import styles from "./examples.module.css";

/**
 * SPA routes: `Sidebar.MenuRouterLink` wraps React Router `NavLink`. Wrap the tree in a router
 * (`BrowserRouter` in apps; `MemoryRouter` in tests and docs).
 */
export default function SidebarExampleRouterNavigation() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className={`${styles.demoViewport} ${styles.row}`}>
        <Sidebar.Root size="m" responsive={false} defaultState="expanded" aria-label="Docs">
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.IdentityButton
                    leading={<span aria-hidden="true">D</span>}
                    title="Docs"
                    subtitle="Router example"
                  />
                </Sidebar.HeaderMain>
              </Sidebar.HeaderRow>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuRouterLink to="/" end className={() => ""}>
                    <Sidebar.MenuIcon>
                      <Home size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Home</Sidebar.MenuLabel>
                  </Sidebar.MenuRouterLink>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuRouterLink to="/settings" className={() => ""}>
                    <Sidebar.MenuIcon>
                      <Settings size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Settings</Sidebar.MenuLabel>
                  </Sidebar.MenuRouterLink>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">R</span>}
                title="Routes"
                subtitle="MemoryRouter"
              />
            </Sidebar.Footer>
          </Sidebar.NavPanel>
        </Sidebar.Root>
        <div className={styles.mainPlaceholder} style={{ flex: "1 1 auto", minWidth: 0 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Typography.Root as="p" variant="body-default" tone="muted">
                  Home route content.
                </Typography.Root>
              }
            />
            <Route
              path="/settings"
              element={
                <Typography.Root as="p" variant="body-default" tone="muted">
                  Settings route content.
                </Typography.Root>
              }
            />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
}
