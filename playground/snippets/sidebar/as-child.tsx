import { ExternalLink, Hexagon } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";

import styles from "./as-child.module.css";

export default function SidebarAsChildSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={styles.stage}>
      <Sidebar.Root
        size="m"
        variant="double"
        defaultActiveSection="main"
        open={open}
        onOpenChange={setOpen}
        responsive={false}
        aria-label="Полиморфные кнопки"
      >
        <Sidebar.ContextBar>
          <Sidebar.ContextBarBody>
            <ul className={styles.ctxList}>
              <li className={styles.ctxItem}>
                <Sidebar.ContextItemButton asChild active>
                  <button type="button" className={styles.ctxLink} aria-label="Раздел демо">
                    <span className={styles.ctxIcon} aria-hidden="true">
                      <Hexagon size={18} strokeWidth={1.9} />
                    </span>
                  </button>
                </Sidebar.ContextItemButton>
              </li>
            </ul>
          </Sidebar.ContextBarBody>
        </Sidebar.ContextBar>

        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.Text>Ссылки вместо кнопок</Sidebar.Text>
              </Sidebar.HeaderMain>
              <Sidebar.ToggleButton />
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.PanelSwitch
              sections={{
                main: (
                  <Sidebar.NavPanelBody>
                    <Sidebar.Menu>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton asChild>
                          <a
                            href="https://example.com"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.menuAnchor}
                          >
                            <Sidebar.MenuIcon>
                              <ExternalLink size={16} strokeWidth={1.9} />
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Внешняя страница</Sidebar.MenuLabel>
                          </a>
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    </Sidebar.Menu>
                  </Sidebar.NavPanelBody>
                ),
              }}
            />
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
