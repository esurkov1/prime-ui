import { BookOpen, Library } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

import styles from "./layout-options.module.css";

function InlinePanelDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.Root
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Панель в потоке"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">◇</span>}
                title="В потоке"
                subtitle="Без слота"
                type="button"
              />
            </Sidebar.HeaderMain>
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
        <Sidebar.Footer>
          <Sidebar.IdentityButton
            leading={<span aria-hidden="true">↓</span>}
            title="Низ панели"
            subtitle="Пример"
            type="button"
          />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}

function PageNavSlotDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className={styles.pageShell}>
      <Sidebar.Root
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
                <Sidebar.IdentityButton
                  leading={<span aria-hidden="true">▣</span>}
                  title="Навигация"
                  subtitle="page-nav"
                  type="button"
                />
              </Sidebar.HeaderMain>
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
          <Sidebar.Footer>
            <Sidebar.IdentityButton
              leading={<span aria-hidden="true">◆</span>}
              title="Слот страницы"
              subtitle="Рядом с main"
              type="button"
            />
          </Sidebar.Footer>
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
          Без <code>sidebarSlot</code>: панель в потоке, ширина по токену{" "}
          <code>--sb-panel-width</code>.
        </p>
        <div className={styles.stage}>
          <InlinePanelDemo />
        </div>
      </div>
      <div className={styles.column}>
        <p className={styles.caption}>
          <code>sidebarSlot=&quot;page-nav&quot;</code> — растяжение в ряду с контентом (как у{" "}
          <code>AppShell</code>).
        </p>
        <div className={styles.stageWide}>
          <PageNavSlotDemo />
        </div>
      </div>
    </div>
  );
}
