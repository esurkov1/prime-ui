/** The parent owns the rail mode: expanded, an icon rail with tooltips, or hidden; only the width animates — `mode`, `onModeChange`. */
import { Icon, SegmentedControl, Sidebar, type SidebarMode } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MODES: { value: SidebarMode; label: string }[] = [
  { value: "expanded", label: "Развёрнут" },
  { value: "compact", label: "Компактный" },
  { value: "hidden", label: "Скрыт" },
];

export default function SidebarControlledExample() {
  const [mode, setMode] = React.useState<SidebarMode>("expanded");

  return (
    <div className={styles.column}>
      <SegmentedControl.Root
        value={mode}
        onValueChange={(next) => setMode(next as SidebarMode)}
        aria-label="Режим навигации"
      >
        {MODES.map((item) => (
          <SegmentedControl.Item key={item.value} value={item.value}>
            {item.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <div className={styles.stage}>
        <Sidebar.Root mode={mode} onModeChange={setMode} offCanvas="never">
          <Sidebar.Header>
            <Sidebar.Brand href="#home" description="Отдел продаж">
              <Sidebar.BrandLogo>
                <span className={styles.logo}>
                  <Icon name="nav.layoutGrid" />
                </span>
              </Sidebar.BrandLogo>
              Прайм CRM
            </Sidebar.Brand>
            <Sidebar.Toggle variant="header" />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Item current>
              <Sidebar.ItemIcon>
                <Icon name="nav.home" />
              </Sidebar.ItemIcon>
              Главная
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="field.email" />
              </Sidebar.ItemIcon>
              Входящие
              <Sidebar.ItemCount>3</Sidebar.ItemCount>
            </Sidebar.Item>
            <Sidebar.Item>
              <Sidebar.ItemIcon>
                <Icon name="nav.layoutGrid" />
              </Sidebar.ItemIcon>
              Отчёты
            </Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Root>
        <div className={styles.content} />
      </div>
    </div>
  );
}
