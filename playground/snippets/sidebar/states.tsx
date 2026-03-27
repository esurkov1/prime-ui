import { Bell, Settings } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

export default function SidebarStatesSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="playgroundSidebarDemo">
      <Sidebar.Root
        open={open}
        onOpenChange={setOpen}
        responsive={false}
        aria-label="Состояния навигации"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.IdentityButton
                  leading={<span aria-hidden="true">✉</span>}
                  title="Почтовый ящик"
                  subtitle="Входящие"
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
                      <Bell size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Новые</Sidebar.MenuLabel>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton type="button" disabled>
                    <Sidebar.MenuIcon>
                      <Settings size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Черновики (нет прав)</Sidebar.MenuLabel>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.NavPanelBody>
          </Sidebar.Content>
          <Sidebar.Footer variant="inset">
            <Sidebar.IdentityButton
              leading={<span aria-hidden="true">?</span>}
              title="Справка"
              subtitle="Встроенный отступ футера"
              type="button"
            />
          </Sidebar.Footer>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
