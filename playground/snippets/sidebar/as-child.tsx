import { ExternalLink } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

import styles from "./as-child.module.css";

export default function SidebarAsChildSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={styles.stage}>
      <Sidebar.Root
        size="m"
        open={open}
        onOpenChange={setOpen}
        responsive={false}
        aria-label="Полиморфные кнопки"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.IdentityButton
                  leading={<span aria-hidden="true">M</span>}
                  title="MenuButton asChild"
                  subtitle="Полиморфизм"
                  type="button"
                />
              </Sidebar.HeaderMain>
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
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
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.IdentityButton
              leading={<span aria-hidden="true">↗</span>}
              title="Внешние ссылки"
              subtitle="Пример"
              type="button"
            />
          </Sidebar.Footer>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
