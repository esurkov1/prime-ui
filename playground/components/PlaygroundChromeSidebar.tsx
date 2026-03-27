import {
  AlignLeft,
  Award,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  Car,
  CheckSquare,
  ChevronDown,
  ChevronsDownUp,
  ChevronsLeftRight,
  ChevronsRight,
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
  Palette,
  PanelLeft,
  PanelRight,
  PanelTop,
  Pipette,
  Plug,
  Ruler,
  ScrollText,
  Settings,
  SlidersHorizontal,
  StretchHorizontal,
  Table,
  Tag,
  TextCursorInput,
  ToggleLeft,
  Type,
  Upload,
  UserRound,
} from "lucide-react";
import * as React from "react";
import { useLocation } from "react-router-dom";

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Select } from "@/components/select/Select";
import { Tooltip } from "@/components/tooltip/Tooltip";
import iconSurfaceStyles from "@/icons/Icon.module.css";
import { Sidebar, useSidebarContext } from "@/layout";

import { getPlaygroundNavModel, type PlaygroundNavModel } from "../playgroundPages";
import {
  PLAYGROUND_THEME_PRESET_OPTIONS,
  type PlaygroundThemePreset,
  usePlaygroundTheme,
} from "./PlaygroundTheme";

type PlaygroundSidebarModeId = "crm" | "traffic" | "autorpark";

type PlaygroundSidebarMode = {
  id: PlaygroundSidebarModeId;
  label: string;
  subtitle: string;
  menuIcon: React.ElementType;
};

type ResolvedMenuItem = {
  id: string;
  label: string;
  to?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
};

type ResolvedMenuCategory = {
  id: string;
  label: string;
  items: ResolvedMenuItem[];
};

type PlaygroundSidebarNavigationApi = {
  modes: PlaygroundSidebarMode[];
  categories: ResolvedMenuCategory[];
};

function toRoute(segment: string): string {
  return segment === "" ? "/" : `/${segment}`;
}

const navIconProps = { size: 16, strokeWidth: 2 as const };

function wrapPlaygroundNavIcon(node: React.ReactNode) {
  return <span className={iconSurfaceStyles.surfaceRaised}>{node}</span>;
}

/** Иконка пункта по маршруту — соответствует смыслу раздела, а не только категории. */
function pageIcon(segment: string): React.ReactNode {
  switch (segment) {
    case "color":
      return wrapPlaygroundNavIcon(<Palette {...navIconProps} />);
    case "typography":
      return wrapPlaygroundNavIcon(<Type {...navIconProps} />);
    case "kbd":
      return wrapPlaygroundNavIcon(<Keyboard {...navIconProps} />);
    case "divider":
      return wrapPlaygroundNavIcon(<Minus {...navIconProps} />);
    case "buttons":
      return wrapPlaygroundNavIcon(<MousePointerClick {...navIconProps} />);
    case "button-group":
      return wrapPlaygroundNavIcon(<Layers {...navIconProps} />);
    case "link-button":
      return wrapPlaygroundNavIcon(<Link2 {...navIconProps} />);
    case "checkbox":
      return wrapPlaygroundNavIcon(<CheckSquare {...navIconProps} />);
    case "color-picker":
      return wrapPlaygroundNavIcon(<Pipette {...navIconProps} />);
    case "datepicker":
      return wrapPlaygroundNavIcon(<Calendar {...navIconProps} />);
    case "digit-input":
      return wrapPlaygroundNavIcon(<Hash {...navIconProps} />);
    case "file-upload":
      return wrapPlaygroundNavIcon(<Upload {...navIconProps} />);
    case "hint":
      return wrapPlaygroundNavIcon(<Info {...navIconProps} />);
    case "input":
      return wrapPlaygroundNavIcon(<TextCursorInput {...navIconProps} />);
    case "label":
      return wrapPlaygroundNavIcon(<Bookmark {...navIconProps} />);
    case "radio":
      return wrapPlaygroundNavIcon(<CircleDot {...navIconProps} />);
    case "select":
      return wrapPlaygroundNavIcon(<ChevronDown {...navIconProps} />);
    case "slider":
      return wrapPlaygroundNavIcon(<SlidersHorizontal {...navIconProps} />);
    case "switch":
      return wrapPlaygroundNavIcon(<ToggleLeft {...navIconProps} />);
    case "textarea":
      return wrapPlaygroundNavIcon(<AlignLeft {...navIconProps} />);
    case "avatar":
      return wrapPlaygroundNavIcon(<UserRound {...navIconProps} />);
    case "badge":
      return wrapPlaygroundNavIcon(<Award {...navIconProps} />);
    case "card":
      return wrapPlaygroundNavIcon(<LayoutDashboard {...navIconProps} />);
    case "code-block":
      return wrapPlaygroundNavIcon(<Code2 {...navIconProps} />);
    case "data-table":
      return wrapPlaygroundNavIcon(<Table {...navIconProps} />);
    case "tag":
      return wrapPlaygroundNavIcon(<Tag {...navIconProps} />);
    case "banner":
      return wrapPlaygroundNavIcon(<Megaphone {...navIconProps} />);
    case "notification":
      return wrapPlaygroundNavIcon(<Bell {...navIconProps} />);
    case "progress-bar":
      return wrapPlaygroundNavIcon(<StretchHorizontal {...navIconProps} />);
    case "segmented-progress-bar":
      return wrapPlaygroundNavIcon(<BarChart3 {...navIconProps} />);
    case "progress-circle":
      return wrapPlaygroundNavIcon(<CircleGauge {...navIconProps} />);
    case "accordion":
      return wrapPlaygroundNavIcon(<ChevronsDownUp {...navIconProps} />);
    case "app-shell":
      return wrapPlaygroundNavIcon(<LayoutTemplate {...navIconProps} />);
    case "page-content":
      return wrapPlaygroundNavIcon(<PanelTop {...navIconProps} />);
    case "scroll-container":
      return wrapPlaygroundNavIcon(<ScrollText {...navIconProps} />);
    case "sidebar":
      return wrapPlaygroundNavIcon(<PanelLeft {...navIconProps} />);
    case "breadcrumb":
      return wrapPlaygroundNavIcon(<ChevronsRight {...navIconProps} />);
    case "pagination":
      return wrapPlaygroundNavIcon(<ChevronsLeftRight {...navIconProps} />);
    case "segmented-control":
      return wrapPlaygroundNavIcon(<LayoutGrid {...navIconProps} />);
    case "stepper":
      return wrapPlaygroundNavIcon(<ListOrdered {...navIconProps} />);
    case "tabs":
      return wrapPlaygroundNavIcon(<LayoutList {...navIconProps} />);
    case "command-menu":
      return wrapPlaygroundNavIcon(<Command {...navIconProps} />);
    case "drawer":
      return wrapPlaygroundNavIcon(<PanelRight {...navIconProps} />);
    case "dropdown":
      return wrapPlaygroundNavIcon(<ChevronDown {...navIconProps} />);
    case "modal":
      return wrapPlaygroundNavIcon(<Maximize2 {...navIconProps} />);
    case "popover":
      return wrapPlaygroundNavIcon(<MessageSquare {...navIconProps} />);
    case "tooltip":
      return wrapPlaygroundNavIcon(<CircleHelp {...navIconProps} />);
    case "control-size":
      return wrapPlaygroundNavIcon(<Ruler {...navIconProps} />);
    case "example-frame":
      return wrapPlaygroundNavIcon(<Frame {...navIconProps} />);
    default:
      return wrapPlaygroundNavIcon(<FileText {...navIconProps} />);
  }
}

function buildSidebarNavigationApi(nav: PlaygroundNavModel): PlaygroundSidebarNavigationApi {
  const modes: PlaygroundSidebarMode[] = [
    {
      id: "crm",
      label: "CRM",
      subtitle: "Продажи и pipeline",
      menuIcon: LayoutDashboard,
    },
    {
      id: "traffic",
      label: "Traffic",
      subtitle: "Кампании и аналитика",
      menuIcon: Megaphone,
    },
    {
      id: "autorpark",
      label: "Autorpark",
      subtitle: "Парк и обслуживание",
      menuIcon: Car,
    },
  ];

  const categories: ResolvedMenuCategory[] = [
    {
      id: "intro",
      label: "Навигация",
      items: [
        {
          id: "intro-page",
          label: nav.intro.label,
          to: toRoute(nav.intro.segment),
          icon: <BookOpen {...navIconProps} />,
        },
      ],
    },
    ...nav.categories.map((category) => ({
      id: category.id,
      label: category.label,
      items: category.pages.map((page) => ({
        id: `${category.id}-${page.segment}`,
        label: page.label,
        to: toRoute(page.segment),
        icon: pageIcon(page.segment),
      })),
    })),
  ];

  return {
    modes,
    categories,
  };
}

function resolveSidebarNavigation(api: PlaygroundSidebarNavigationApi): {
  mode: PlaygroundSidebarMode;
  categories: ResolvedMenuCategory[];
} {
  const mode = api.modes[0];
  if (mode === undefined) {
    throw new Error("[playground] sidebar mode list is empty");
  }
  return { mode, categories: api.categories };
}

function modeMarkStyle(modeId: PlaygroundSidebarModeId): React.CSSProperties {
  switch (modeId) {
    case "crm":
      return {
        background:
          "color-mix(in srgb, var(--prime-sys-color-action-primaryBackground) 82%, transparent)",
        color: "var(--prime-sys-color-action-primaryForeground)",
      };
    case "traffic":
      return {
        background:
          "color-mix(in srgb, var(--prime-sys-color-feedback-infoBackground) 82%, var(--prime-sys-color-surface-default))",
        color: "var(--prime-sys-color-feedback-infoForeground)",
      };
    case "autorpark":
      return {
        background:
          "color-mix(in srgb, var(--prime-sys-color-feedback-warningBackground) 84%, var(--prime-sys-color-surface-default))",
        color: "var(--prime-sys-color-feedback-warningForeground)",
      };
  }
}

function isThemePreset(value: string): value is PlaygroundThemePreset {
  return PLAYGROUND_THEME_PRESET_OPTIONS.some((option) => option.value === value);
}

function SidebarMenuControl({ item }: { item: ResolvedMenuItem }) {
  if (item.to !== undefined) {
    return (
      <Sidebar.MenuRouterLink to={item.to} end={item.to === "/"}>
        {item.icon !== undefined ? <Sidebar.MenuIcon>{item.icon}</Sidebar.MenuIcon> : null}
        <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
      </Sidebar.MenuRouterLink>
    );
  }

  return (
    <Sidebar.MenuButton type="button" onClick={item.onSelect}>
      {item.icon !== undefined ? <Sidebar.MenuIcon>{item.icon}</Sidebar.MenuIcon> : null}
      <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
    </Sidebar.MenuButton>
  );
}

function PlaygroundPanelRow({ item }: { item: ResolvedMenuItem }) {
  const { state, isMobile } = useSidebarContext();
  const compactTooltipEnabled = !isMobile && state === "compact";

  return (
    <Sidebar.MenuItem>
      {compactTooltipEnabled ? (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <SidebarMenuControl item={item} />
          </Tooltip.Trigger>
          <Tooltip.Content side="right" size="l">
            {item.label}
          </Tooltip.Content>
        </Tooltip.Root>
      ) : (
        <SidebarMenuControl item={item} />
      )}
    </Sidebar.MenuItem>
  );
}

function PlaygroundTreeMenu({ categories }: { categories: ResolvedMenuCategory[] }) {
  return (
    <Sidebar.NavDocTree>
      {categories.map((category) => (
        <Sidebar.Group key={category.id}>
          <Sidebar.GroupLabel>{category.label}</Sidebar.GroupLabel>
          <Sidebar.Menu>
            {category.items.map((item) => (
              <PlaygroundPanelRow key={item.id} item={item} />
            ))}
          </Sidebar.Menu>
        </Sidebar.Group>
      ))}
    </Sidebar.NavDocTree>
  );
}

function PlaygroundModeSwitcher({
  mode,
  modes,
  onModeChange,
}: {
  mode: PlaygroundSidebarMode;
  modes: PlaygroundSidebarMode[];
  onModeChange: (next: PlaygroundSidebarModeId) => void;
}) {
  const ModeIcon = mode.menuIcon;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2rem",
                height: "2rem",
                borderRadius: "var(--prime-sys-shape-radius-s)",
                ...modeMarkStyle(mode.id),
              }}
            >
              <ModeIcon size={16} strokeWidth={2} />
            </span>
          }
          title={mode.label}
          subtitle={mode.subtitle}
          aria-label="Переключить режим навигации"
        />
      </Dropdown.Trigger>

      <Dropdown.Content align="start" sameMinWidthAsTrigger>
        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Режим продукта</Dropdown.GroupLabel>
            {modes.map((entry) => (
              <Dropdown.Item key={entry.id} onSelect={() => onModeChange(entry.id)}>
                <Dropdown.ItemIcon as={entry.menuIcon} size={16} strokeWidth={2} />
                {entry.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Group>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function PlaygroundUserMenu() {
  const { scheme, setScheme, preset, setPreset } = usePlaygroundTheme();

  const onSchemeChange = React.useCallback(
    (next: string) => {
      setScheme(next === "dark" ? "dark" : "light");
    },
    [setScheme],
  );

  const onPresetChange = React.useCallback(
    (next: string) => {
      if (isThemePreset(next)) {
        setPreset(next);
      }
    },
    [setPreset],
  );

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <Avatar.Root>
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
                <Avatar.Root>
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

        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Оформление</Dropdown.GroupLabel>
            <div
              style={{
                display: "grid",
                gap: "var(--prime-sys-spacing-x3)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "var(--prime-sys-spacing-x1)",
                }}
              >
                <Sidebar.Text
                  style={{
                    fontSize: "var(--prime-sys-size-control-s-supportText)",
                    color: "var(--prime-sys-color-content-secondary)",
                  }}
                >
                  Тема интерфейса
                </Sidebar.Text>
                <Select.Root value={scheme} onChange={onSchemeChange}>
                  <Select.Trigger aria-label="Схема темы playground">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="light">Светлая</Select.Item>
                    <Select.Item value="dark">Тёмная</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "var(--prime-sys-spacing-x1)",
                }}
              >
                <Sidebar.Text
                  style={{
                    fontSize: "var(--prime-sys-size-control-s-supportText)",
                    color: "var(--prime-sys-color-content-secondary)",
                  }}
                >
                  Бренд-тема
                </Sidebar.Text>
                <Select.Root value={preset} onChange={onPresetChange}>
                  <Select.Trigger aria-label="Палитра бренд-темы playground">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {PLAYGROUND_THEME_PRESET_OPTIONS.map((option) => (
                      <Select.Item key={option.value} value={option.value} label={option.label}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
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

const PLAYGROUND_SIDEBAR_NAV_SCROLL_ID = "playground-sidebar-nav-scroll";

export function PlaygroundChromeSidebar() {
  const { pathname } = useLocation();
  const nav = React.useMemo(() => getPlaygroundNavModel(), []);
  const navigationApi = React.useMemo(() => buildSidebarNavigationApi(nav), [nav]);

  const { mode, categories } = React.useMemo(
    () => resolveSidebarNavigation(navigationApi),
    [navigationApi],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: прокрутка к активному пункту при смене маршрута и при первом монтировании
  React.useLayoutEffect(() => {
    const scrollRoot = document.getElementById(PLAYGROUND_SIDEBAR_NAV_SCROLL_ID);
    if (scrollRoot === null) return;
    const active = scrollRoot.querySelector<HTMLElement>("a[aria-current='page']");
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <Sidebar.Root sidebarSlot="page-nav" aria-label="Навигация playground">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <PlaygroundModeSwitcher
                mode={mode}
                modes={navigationApi.modes}
                onModeChange={() => {}}
              />
            </Sidebar.HeaderMain>
          </Sidebar.HeaderRow>
        </Sidebar.Header>

        <Tooltip.Provider delayDuration={0}>
          <Sidebar.Content id={PLAYGROUND_SIDEBAR_NAV_SCROLL_ID}>
            <PlaygroundTreeMenu categories={categories} />
          </Sidebar.Content>
        </Tooltip.Provider>

        <Sidebar.Footer>
          <PlaygroundUserMenu />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
