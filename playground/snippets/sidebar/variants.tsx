import { FolderOpen, LayoutGrid, Search } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

import styles from "./variants.module.css";

function MiniSimple() {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.Root
      size="m"
      variant="simple"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Простой сайдбар"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Одна колонка</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button" active>
                <Sidebar.MenuIcon>
                  <FolderOpen size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Проекты</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button">
                <Sidebar.MenuIcon>
                  <Search size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Поиск</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}

function MiniDouble() {
  const [open, setOpen] = React.useState(true);
  const items = [
    { id: "a", label: "A", icon: <LayoutGrid size={16} strokeWidth={1.9} /> },
    { id: "b", label: "B", icon: <FolderOpen size={16} strokeWidth={1.9} /> },
  ];
  return (
    <Sidebar.Root
      size="m"
      variant="double"
      defaultActiveSection="a"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Двойной сайдбар"
    >
      <Sidebar.ContextBar items={items} />
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Панель раздела</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              a: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Раздел A</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              ),
              b: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Раздел B</Sidebar.MenuLabel>
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
  );
}

export default function SidebarVariantsSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.cell}>
        <p className={styles.label}>
          <code>variant=&quot;simple&quot;</code>
        </p>
        <div className={styles.stage}>
          <MiniSimple />
        </div>
      </div>
      <div className={styles.cell}>
        <p className={styles.label}>
          <code>variant=&quot;double&quot;</code>
        </p>
        <div className={styles.stage}>
          <MiniDouble />
        </div>
      </div>
    </div>
  );
}
