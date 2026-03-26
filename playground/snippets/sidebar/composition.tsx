import { ChevronRight, Ellipsis, FileText, FolderOpen } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

import styles from "./composition.module.css";

function FavoritesCategory() {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.NavCategory>
      <Sidebar.NavCategoryTrigger
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Sidebar.NavCategoryLabel>Документация</Sidebar.NavCategoryLabel>
        <Sidebar.NavCategoryCount>4</Sidebar.NavCategoryCount>
      </Sidebar.NavCategoryTrigger>
      {open ? (
        <Sidebar.NavCategoryPanel>
          <Sidebar.NavDocTree>
            <div className={styles.treeRow}>
              <ChevronRight size={14} strokeWidth={2} aria-hidden className={styles.treeChevron} />
              <Sidebar.Text>Введение</Sidebar.Text>
            </div>
            <div className={styles.treeRow}>
              <ChevronRight size={14} strokeWidth={2} aria-hidden className={styles.treeChevron} />
              <Sidebar.Text>Установка</Sidebar.Text>
            </div>
            <div className={styles.treeRow}>
              <FileText size={14} strokeWidth={1.9} aria-hidden className={styles.treeIcon} />
              <Sidebar.Text>API reference</Sidebar.Text>
            </div>
          </Sidebar.NavDocTree>
        </Sidebar.NavCategoryPanel>
      ) : null}
    </Sidebar.NavCategory>
  );
}

export default function SidebarCompositionSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={styles.demoRoot}>
      <Sidebar.Root
        size="m"
        open={open}
        onOpenChange={setOpen}
        responsive={false}
        aria-label="Композиция сайдбара"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <Sidebar.IdentityButton
                  leading={
                    <span className={styles.brandMark} aria-hidden="true">
                      P
                    </span>
                  }
                  title="Prime UI Kit"
                  subtitle="Playground"
                  type="button"
                />
              </Sidebar.HeaderMain>
              <Sidebar.ToggleButton />
            </Sidebar.HeaderRow>
          </Sidebar.Header>

          <Sidebar.Content>
            <Sidebar.NavPanelBody>
              <FavoritesCategory />
              <Sidebar.Group>
                <Sidebar.GroupLabel>Разделы</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button" active>
                      <Sidebar.MenuIcon>
                        <FileText size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Обзор</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                    <Sidebar.MenuAction type="button" aria-label="Действия раздела">
                      <Ellipsis size={16} strokeWidth={2} />
                    </Sidebar.MenuAction>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton type="button">
                      <Sidebar.MenuIcon>
                        <FolderOpen size={16} strokeWidth={1.9} />
                      </Sidebar.MenuIcon>
                      <Sidebar.MenuLabel>Структура</Sidebar.MenuLabel>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.Group>
            </Sidebar.NavPanelBody>
          </Sidebar.Content>
        </Sidebar.NavPanel>
      </Sidebar.Root>
    </div>
  );
}
