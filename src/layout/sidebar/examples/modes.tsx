/** Controlled `mode` switched by a SegmentedControl: expanded, compact and hidden, all animating the rail width. Use when the app lets users collapse the navigation. */
import { FileText, Home, Inbox, Settings, Users } from "lucide-react";
import { SegmentedControl, Sidebar, type SidebarMode } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MODES: { value: SidebarMode; label: string }[] = [
  { value: "expanded", label: "Развёрнут" },
  { value: "compact", label: "Компактный" },
  { value: "hidden", label: "Скрыт" },
];

export default function SidebarModesExample() {
  const [mode, setMode] = React.useState<SidebarMode>("expanded");

  return (
    <div className={styles.column}>
      <SegmentedControl.Root
        value={mode}
        onValueChange={(next) => setMode(next as SidebarMode)}
        aria-label="Режим сайдбара"
      >
        {MODES.map((m) => (
          <SegmentedControl.Item key={m.value} value={m.value}>
            {m.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <div className={styles.stage} data-testid="sidebar-modes-stage">
        <Sidebar.Root mode={mode} onModeChange={setMode} responsive={false}>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon={<Home />} active>
                Главная
              </Sidebar.Item>
              <Sidebar.Item icon={<Inbox />} badge={3}>
                Входящие
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Работа">
              <Sidebar.Item icon={<Users />}>Клиенты</Sidebar.Item>
              <Sidebar.Item icon={<FileText />}>Отчёты</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<Settings />}>Настройки</Sidebar.Item>
            <Sidebar.Toggle />
          </Sidebar.Footer>
        </Sidebar.Root>
        <div className={styles.content} />
      </div>
    </div>
  );
}
