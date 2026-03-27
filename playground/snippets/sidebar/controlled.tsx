import { Layers, Sparkles } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/button/Button";
import { Sidebar } from "@/layout";

import styles from "./controlled.module.css";

export default function SidebarControlledSnippet() {
  const [state, setState] = React.useState<"expanded" | "hidden">("expanded");
  const open = state !== "hidden";

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button.Root
          size="s"
          mode="stroke"
          type="button"
          onClick={() => setState((prev) => (prev === "hidden" ? "expanded" : "hidden"))}
        >
          {open ? "Скрыть" : "Показать"}
        </Button.Root>
      </div>

      <div className={styles.stage}>
        <Sidebar.Root
          size="m"
          state={state}
          onStateChange={(next) => setState(next === "hidden" ? "hidden" : "expanded")}
          responsive={false}
          aria-label="Контролируемый сайдбар"
        >
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.IdentityButton
                    leading={<span aria-hidden="true">P</span>}
                    title="Панель"
                    subtitle="Контролируемая"
                    type="button"
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
                      <Sidebar.MenuLabel>Раздел</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <Sparkles size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Ещё пункт</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.NavPanelBody>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">API</span>}
                title="Состояние"
                subtitle="state / onStateChange"
                type="button"
              />
            </Sidebar.Footer>
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </div>
    </div>
  );
}
