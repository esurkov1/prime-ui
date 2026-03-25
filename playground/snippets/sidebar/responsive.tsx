import { Inbox } from "lucide-react";
import * as React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";

import styles from "./responsive.module.css";

function Sample({ responsive }: { responsive: boolean }) {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.Root
      size="m"
      variant="simple"
      responsive={responsive}
      open={open}
      onOpenChange={setOpen}
      aria-label={responsive ? "С адаптивным режимом" : "Без адаптивного режима"}
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Ящик</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button" active>
                <Sidebar.MenuIcon>
                  <Inbox size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Входящие</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}

export default function SidebarResponsiveSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.column}>
        <p className={styles.caption}>
          <code>responsive=&#123;false&#125;</code> — не реагирует на порог окна{" "}
          <code>(max-width: 64rem)</code>: оверлей и автозакрытие при смене ширины отключены.
        </p>
        <div className={styles.stage}>
          <Sample responsive={false} />
        </div>
      </div>
      <div className={styles.column}>
        <p className={styles.caption}>
          <code>responsive=&#123;true&#125;</code> (значение по умолчанию) — на узком окне панель
          скрывается за край, появляются затемнение и плавающая кнопка открытия.
        </p>
        <div className={styles.stage}>
          <Sample responsive />
        </div>
      </div>
    </div>
  );
}
