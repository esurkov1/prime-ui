import { LayoutList } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/layout";

import styles from "./full-width.module.css";

export default function SidebarFullWidthSnippet() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className={styles.outer}>
      <p className={styles.hint}>
        Родитель на всю ширину превью; <code>sidebarSlot=&quot;page-nav&quot;</code> помогает
        вписать колонку в ряд с основной областью без «обрезания» по высоте.
      </p>
      <div className={styles.row}>
        <Sidebar.Root
          sidebarSlot="page-nav"
          open={open}
          onOpenChange={setOpen}
          responsive={false}
          className={styles.sidebar}
          aria-label="Сайдбар на всю доступную ширину слота"
        >
          <Sidebar.NavPanel>
            <Sidebar.Header>
              <Sidebar.HeaderRow>
                <Sidebar.HeaderMain>
                  <Sidebar.IdentityButton
                    leading={<span aria-hidden="true">K</span>}
                    title="Каталог"
                    subtitle="На всю ширину слота"
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
                      <LayoutList size={16} strokeWidth={1.9} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>Все позиции</Sidebar.MenuLabel>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.Content>
            <Sidebar.Footer>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">▭</span>}
                title="Контент справа"
                subtitle="Сетка рядом"
                type="button"
              />
            </Sidebar.Footer>
          </Sidebar.NavPanel>
        </Sidebar.Root>
        <div className={styles.content}>Основной контент</div>
      </div>
    </div>
  );
}
