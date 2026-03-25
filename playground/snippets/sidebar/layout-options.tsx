import { BookOpen, Library } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";

import styles from "./layout-options.module.css";

function CompactPanelDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.Root
      size="m"
      variant="simple"
      panelWidth="compact"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Компактная ширина панели"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Компакт</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button" active>
                <Sidebar.MenuIcon>
                  <BookOpen size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Главы</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}

function PageNavSlotDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className={styles.pageShell}>
      <Sidebar.Root
        size="m"
        variant="simple"
        sidebarSlot="page-nav"
        open={open}
        onOpenChange={setOpen}
        responsive={false}
        aria-label="Слот навигации страницы"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.Text>Навигация</Sidebar.Text>
              </Sidebar.HeaderMain>
              <Sidebar.ToggleButton />
            </Sidebar.HeaderRow>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuIcon>
                    <Library size={16} strokeWidth={1.9} />
                  </Sidebar.MenuIcon>
                  <Sidebar.MenuLabel>Каталог</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>
      <main className={styles.main}>Область контента рядом со слотом</main>
    </div>
  );
}

export default function SidebarLayoutOptionsSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.column}>
        <p className={styles.caption}>
          <code>panelWidth=&quot;compact&quot;</code> — уже панель (<code>--sb-panel-width</code>).
        </p>
        <div className={styles.stage}>
          <CompactPanelDemo />
        </div>
      </div>
      <div className={styles.column}>
        <p className={styles.caption}>
          <code>sidebarSlot=&quot;page-nav&quot;</code> — растяжение в ряду с контентом (как у{" "}
          <code>PageShell</code>).
        </p>
        <div className={styles.stageWide}>
          <PageNavSlotDemo />
        </div>
      </div>
    </div>
  );
}
