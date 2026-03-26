import { Layers, Sparkles } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/button/Button";
import { Sidebar } from "@/layout";

import styles from "./controlled.module.css";

export default function SidebarControlledSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button.Root size="s" mode="stroke" type="button" onClick={() => setOpen((o) => !o)}>
          {open ? "Скрыть" : "Показать"}
        </Button.Root>
      </div>

      <div className={styles.stage}>
        <Sidebar.Root
          size="m"
          open={open}
          onOpenChange={setOpen}
          responsive={false}
          aria-label="Контролируемый сайдбар"
        >
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.Text>Панель</Sidebar.Text>
                </Sidebar.HeaderMain>
                <Sidebar.ToggleButton />
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
          </Sidebar.NavPanel>
        </Sidebar.Root>
      </div>
    </div>
  );
}
