import { Layers, Sparkles } from "lucide-react";
import { Button, Sidebar, type SidebarLayoutMode, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Контролируемый режим: родитель задаёт `state` / `onStateChange`; кнопка на грани панели вызывает то же переключение через контекст.
 */
export default function SidebarExampleControlledState() {
  const [state, setState] = React.useState<SidebarLayoutMode>("expanded");

  return (
    <div className={`${styles.demoViewport} ${styles.controlledColumn}`}>
      <div className={styles.toolbar}>
        <Button.Root
          size="s"
          mode="stroke"
          type="button"
          onClick={() => setState((prev) => (prev === "hidden" ? "expanded" : "hidden"))}
        >
          {state === "hidden" ? "Show sidebar" : "Hide sidebar"}
        </Button.Root>
        <Typography.Root as="span" variant="body-small" tone="muted">
          Current: <span className={styles.code}>{state}</span>
        </Typography.Root>
      </div>
      <div className={styles.controlledStage}>
        <Sidebar.Root
          size="m"
          state={state}
          onStateChange={setState}
          responsive={false}
          aria-label="Controlled sidebar"
        >
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.IdentityButton
                    leading={<span aria-hidden="true">P</span>}
                    title="Panel"
                    subtitle="Controlled"
                  />
                </Sidebar.HeaderMain>
              </Sidebar.HeaderRow>
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.NavPanelBody>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button" active>
                      <Sidebar.MenuIcon>
                        <Layers size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Section</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <Sparkles size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Another item</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.NavPanelBody>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">●</span>}
                title="API"
                subtitle="state / onStateChange"
              />
            </Sidebar.Footer>
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </div>
    </div>
  );
}
