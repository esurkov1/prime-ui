import {
  Car,
  ChevronRight,
  Ellipsis,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Plug,
  Settings,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Sidebar } from "@/layout";

import styles from "./composition.module.css";

type DemoModeId = "crm" | "traffic" | "autorpark";

type DemoMode = {
  id: DemoModeId;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  avatar: string;
};

const MODES: DemoMode[] = [
  { id: "crm", label: "CRM", subtitle: "Продажи", icon: LayoutDashboard, avatar: "CR" },
  { id: "traffic", label: "Traffic", subtitle: "Кампании", icon: Megaphone, avatar: "TR" },
  { id: "autorpark", label: "Autorpark", subtitle: "Парк", icon: Car, avatar: "AP" },
];

const userTriggerStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "calc(var(--prime-sys-size-control-m-height) + var(--prime-sys-spacing-x3))",
  minWidth: "calc(var(--prime-sys-size-control-m-height) + var(--prime-sys-spacing-x3))",
  minHeight: "calc(var(--prime-sys-size-control-m-height) + var(--prime-sys-spacing-x3))",
  border: 0,
  borderRadius: "var(--prime-sys-size-control-m-radius)",
  background: "transparent",
  cursor: "pointer",
  color: "var(--prime-sys-color-content-primary)",
};

function FavoritesCategory() {
  const [open, setOpen] = React.useState(true);
  return (
    <Sidebar.NavCategory>
      <Sidebar.NavCategoryTrigger
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
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

function ModeSwitcher({
  mode,
  onModeChange,
}: {
  mode: DemoMode;
  onModeChange: (id: DemoModeId) => void;
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <Avatar.Root
              size="m"
              style={{
                background:
                  "color-mix(in srgb, var(--prime-sys-color-action-primaryBackground) 84%, transparent)",
                color: "var(--prime-sys-color-action-primaryForeground)",
              }}
            >
              <Avatar.Fallback>{mode.avatar}</Avatar.Fallback>
            </Avatar.Root>
          }
          title={mode.label}
          subtitle={mode.subtitle}
          type="button"
          aria-label="Режим в примере"
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="start" sameMinWidthAsTrigger>
        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Режим</Dropdown.GroupLabel>
            {MODES.map((entry) => (
              <Dropdown.Item key={entry.id} onSelect={() => onModeChange(entry.id)}>
                <Dropdown.ItemIcon as={entry.icon} size={16} strokeWidth={2} />
                {entry.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Group>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function HeaderUserPopover() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button type="button" style={userTriggerStyle} aria-label="Пользовательские настройки">
          <Avatar.Root size="m">
            <Avatar.Fallback>ES</Avatar.Fallback>
          </Avatar.Root>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content align="end" side="bottom">
        <Dropdown.Block>
          <Dropdown.Header>
            <Dropdown.HeaderRow>
              <Dropdown.HeaderLeading>
                <Avatar.Root size="m">
                  <Avatar.Fallback>ES</Avatar.Fallback>
                </Avatar.Root>
              </Dropdown.HeaderLeading>
              <Dropdown.HeaderMain>
                <Dropdown.HeaderTitle>Egor Surkov</Dropdown.HeaderTitle>
                <Dropdown.HeaderDescription truncate>
                  egor.surkov@example.com
                </Dropdown.HeaderDescription>
              </Dropdown.HeaderMain>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>

          <Dropdown.Group>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={UserRound} size={16} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Plug} size={16} strokeWidth={2} />
              Интеграции
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} size={16} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>

        <Dropdown.Separator />

        <Dropdown.Block>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={LogOut} size={16} strokeWidth={2} />
            Выйти
          </Dropdown.Item>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export default function SidebarCompositionSnippet() {
  const [state, setState] = React.useState<"expanded" | "compact" | "hidden">("expanded");
  const [modeId, setModeId] = React.useState<DemoModeId>("crm");

  const mode = React.useMemo(
    () => MODES.find((entry) => entry.id === modeId) ?? MODES[0],
    [modeId],
  );

  return (
    <div className={styles.demoRoot}>
      <Sidebar.Root
        size="m"
        state={state}
        onStateChange={setState}
        responsive={false}
        aria-label="Композиция сайдбара"
      >
        <Sidebar.NavPanel>
          <Sidebar.Header>
            <Sidebar.HeaderRow>
              <Sidebar.HeaderMain>
                <ModeSwitcher mode={mode} onModeChange={setModeId} />
              </Sidebar.HeaderMain>
              <HeaderUserPopover />
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
