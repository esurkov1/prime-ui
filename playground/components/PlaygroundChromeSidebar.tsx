import {
  BookOpen,
  FileText,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Palette,
  Settings,
  SlidersHorizontal,
  SunMoon,
  UserRound,
  Wrench,
} from "lucide-react";
import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Icon } from "@/icons";
import { Sidebar } from "@/layout";

import { getPlaygroundNavModel } from "../playgroundPages";
import { PLAYGROUND_THEME_PRESET_OPTIONS, usePlaygroundTheme } from "./PlaygroundTheme";

type PlaygroundMenuItem = {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
};

function toRoute(segment: string): string {
  return segment === "" ? "/" : `/${segment}`;
}

function categoryIcon(label: string): React.ReactNode {
  const normalized = label.trim().toLowerCase();
  if (normalized.includes("foundation")) return <LayoutGrid size={16} strokeWidth={2} />;
  if (normalized.includes("action")) return <Wrench size={16} strokeWidth={2} />;
  if (normalized.includes("form")) return <SlidersHorizontal size={16} strokeWidth={2} />;
  return <FileText size={16} strokeWidth={2} />;
}

function PlaygroundPanelRow({ item }: { item: PlaygroundMenuItem }) {
  if (item.to !== undefined) {
    return (
      <Sidebar.MenuItem>
        <Sidebar.MenuRouterLink to={item.to} end={item.to === "/"}>
          {item.icon !== undefined ? <Sidebar.MenuIcon>{item.icon}</Sidebar.MenuIcon> : null}
          <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
        </Sidebar.MenuRouterLink>
      </Sidebar.MenuItem>
    );
  }

  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton type="button" onClick={item.onSelect}>
        {item.icon !== undefined ? <Sidebar.MenuIcon>{item.icon}</Sidebar.MenuIcon> : null}
        <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
}

function PlaygroundTreeMenu() {
  const nav = React.useMemo(() => getPlaygroundNavModel(), []);

  return (
    <Sidebar.NavDocTree>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Навигация</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <PlaygroundPanelRow
            item={{
              label: nav.intro.label,
              to: toRoute(nav.intro.segment),
              icon: <BookOpen size={16} strokeWidth={2} />,
            }}
          />
        </Sidebar.Menu>
      </Sidebar.Group>

      {nav.categories.map((category) => (
        <Sidebar.Group key={category.id}>
          <Sidebar.GroupLabel>{category.label}</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {category.pages.map((page) => (
              <PlaygroundPanelRow
                key={page.segment}
                item={{
                  label: page.label,
                  to: toRoute(page.segment),
                  icon: categoryIcon(category.label),
                }}
              />
            ))}
          </Sidebar.Menu>
        </Sidebar.Group>
      ))}
    </Sidebar.NavDocTree>
  );
}

function PlaygroundBrandMenu() {
  const { scheme, toggleScheme, preset, setPreset } = usePlaygroundTheme();
  const presetIndex = PLAYGROUND_THEME_PRESET_OPTIONS.findIndex(
    (option) => option.value === preset,
  );
  const presetLabel = PLAYGROUND_THEME_PRESET_OPTIONS[presetIndex]?.label ?? "Custom";

  const cyclePreset = React.useCallback(() => {
    const nextIndex =
      presetIndex < 0 ? 0 : (presetIndex + 1) % PLAYGROUND_THEME_PRESET_OPTIONS.length;
    const nextPreset = PLAYGROUND_THEME_PRESET_OPTIONS[nextIndex];
    if (nextPreset !== undefined) {
      setPreset(nextPreset.value);
    }
  }, [presetIndex, setPreset]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <span
              className="playgroundSidebarBrandMark"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--prime-sys-color-action-primaryForeground)",
              }}
            >
              <Icon name="nav.layoutGrid" size="m" />
            </span>
          }
          title="Prime-UI"
          subtitle="Reakt UI-Kit"
          aria-label="Меню бренда и темы"
        />
      </Dropdown.Trigger>

      <Dropdown.Content align="start" sameMinWidthAsTrigger>
        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Оформление</Dropdown.GroupLabel>
            <Dropdown.Item onSelect={toggleScheme}>
              <Dropdown.ItemIcon as={SunMoon} size={16} strokeWidth={2} />
              {scheme === "light" ? "Тема: Светлая" : "Тема: Тёмная"}
            </Dropdown.Item>
            <Dropdown.Item onSelect={cyclePreset}>
              <Dropdown.ItemIcon as={Palette} size={16} strokeWidth={2} />
              Бренд-тема: {presetLabel}
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function PlaygroundUserMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <Avatar.Root size="m">
              <Avatar.Fallback>ES</Avatar.Fallback>
            </Avatar.Root>
          }
          title="Egor Surkov"
          subtitle="Product Engineer"
          aria-label="Меню пользователя"
        />
      </Dropdown.Trigger>

      <Dropdown.Content align="start" side="top" sameMinWidthAsTrigger>
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
              Профиль и безопасность
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={LayoutGrid} size={16} strokeWidth={2} />
              Интеграции
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} size={16} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>

        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Поддержка</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={BookOpen} size={16} strokeWidth={2} />
              Руководство
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={HelpCircle} size={16} strokeWidth={2} />
              Справочный центр
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

export function PlaygroundChromeSidebar() {
  return (
    <Sidebar.Root sidebarSlot="page-nav" aria-label="Навигация playground">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <PlaygroundBrandMenu />
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>

        <Sidebar.Content>
          <PlaygroundTreeMenu />
        </Sidebar.Content>

        <Sidebar.Footer>
          <PlaygroundUserMenu />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
