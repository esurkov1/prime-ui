import {
  AlignLeft,
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronsDownUp,
  ChevronsLeftRight,
  ChevronsRight,
  ChevronsUpDown,
  CircleDot,
  CircleGauge,
  CircleHelp,
  Code2,
  Command,
  FileText,
  Frame,
  Hash,
  HelpCircle,
  Info,
  Keyboard,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  Link2,
  ListOrdered,
  LogOut,
  Maximize2,
  Megaphone,
  MessageSquare,
  Minus,
  MousePointerClick,
  Package,
  Palette,
  PanelLeft,
  PanelRight,
  PanelTop,
  PieChart,
  Pipette,
  Plug,
  Ruler,
  ScrollText,
  Settings,
  SlidersHorizontal,
  StretchHorizontal,
  SunMoon,
  Table,
  Tag,
  TextCursorInput,
  ToggleLeft,
  Type,
  Upload,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
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

const navIconProps = { size: 16, strokeWidth: 2 as const };

/** Иконка пункта по маршруту — соответствует смыслу раздела, а не только категории. */
function pageIcon(segment: string): React.ReactNode {
  switch (segment) {
    case "color":
      return <Palette {...navIconProps} />;
    case "typography":
      return <Type {...navIconProps} />;
    case "kbd":
      return <Keyboard {...navIconProps} />;
    case "divider":
      return <Minus {...navIconProps} />;
    case "buttons":
      return <MousePointerClick {...navIconProps} />;
    case "button-group":
      return <Layers {...navIconProps} />;
    case "link-button":
      return <Link2 {...navIconProps} />;
    case "checkbox":
      return <CheckSquare {...navIconProps} />;
    case "color-picker":
      return <Pipette {...navIconProps} />;
    case "datepicker":
      return <Calendar {...navIconProps} />;
    case "digit-input":
      return <Hash {...navIconProps} />;
    case "file-upload":
      return <Upload {...navIconProps} />;
    case "hint":
      return <Info {...navIconProps} />;
    case "input":
      return <TextCursorInput {...navIconProps} />;
    case "label":
      return <Bookmark {...navIconProps} />;
    case "radio":
      return <CircleDot {...navIconProps} />;
    case "select":
      return <ChevronsUpDown {...navIconProps} />;
    case "slider":
      return <SlidersHorizontal {...navIconProps} />;
    case "switch":
      return <ToggleLeft {...navIconProps} />;
    case "textarea":
      return <AlignLeft {...navIconProps} />;
    case "avatar":
      return <UserRound {...navIconProps} />;
    case "badge":
      return <Award {...navIconProps} />;
    case "dashboard-card":
      return <LayoutDashboard {...navIconProps} />;
    case "code-block":
      return <Code2 {...navIconProps} />;
    case "data-table":
      return <Table {...navIconProps} />;
    case "tag":
      return <Tag {...navIconProps} />;
    case "banner":
      return <Megaphone {...navIconProps} />;
    case "notification":
      return <Bell {...navIconProps} />;
    case "progress-bar":
      return <StretchHorizontal {...navIconProps} />;
    case "progress-circle":
      return <CircleGauge {...navIconProps} />;
    case "segmented-progress-bar":
      return <PieChart {...navIconProps} />;
    case "accordion":
      return <ChevronsDownUp {...navIconProps} />;
    case "app-shell":
      return <LayoutTemplate {...navIconProps} />;
    case "page-content":
      return <PanelTop {...navIconProps} />;
    case "scroll-container":
      return <ScrollText {...navIconProps} />;
    case "sidebar":
      return <PanelLeft {...navIconProps} />;
    case "breadcrumb":
      return <ChevronsRight {...navIconProps} />;
    case "pagination":
      return <ChevronsLeftRight {...navIconProps} />;
    case "segmented-control":
      return <LayoutGrid {...navIconProps} />;
    case "stepper":
      return <ListOrdered {...navIconProps} />;
    case "tabs":
      return <LayoutList {...navIconProps} />;
    case "command-menu":
      return <Command {...navIconProps} />;
    case "drawer":
      return <PanelRight {...navIconProps} />;
    case "dropdown":
      return <ChevronDown {...navIconProps} />;
    case "modal":
      return <Maximize2 {...navIconProps} />;
    case "popover":
      return <MessageSquare {...navIconProps} />;
    case "tooltip":
      return <CircleHelp {...navIconProps} />;
    case "control-size":
      return <Ruler {...navIconProps} />;
    case "example-frame":
      return <Frame {...navIconProps} />;
    default:
      return <FileText {...navIconProps} />;
  }
}

function PlaygroundPanelRow({ item }: { item: PlaygroundMenuItem }) {
  if (item.to !== undefined) {
    return (
      <Sidebar.MenuItem>
        <Sidebar.MenuRouterLink to={item.to} end={item.to === "/"} tooltip={item.label}>
          {item.icon !== undefined ? <Sidebar.MenuIcon>{item.icon}</Sidebar.MenuIcon> : null}
          <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
        </Sidebar.MenuRouterLink>
      </Sidebar.MenuItem>
    );
  }

  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton type="button" onClick={item.onSelect} tooltip={item.label}>
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
              icon: <BookOpen {...navIconProps} />,
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
                  icon: pageIcon(page.segment),
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
              <Package size="1.25em" strokeWidth={2} />
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
              <Dropdown.ItemIcon as={Plug} size={16} strokeWidth={2} />
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
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.ToggleButton placement="edge" />

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
