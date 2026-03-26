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

import { Avatar } from "@/components/avatar/Avatar";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Select } from "@/components/select/Select";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Sidebar, useSidebarContext } from "@/layout";

import { getPlaygroundNavModel, type PlaygroundNavModel } from "../playgroundPages";
import {
  PLAYGROUND_THEME_PRESET_OPTIONS,
  type PlaygroundThemePreset,
  usePlaygroundTheme,
} from "./PlaygroundTheme";

type PlaygroundSidebarModeId = "crm" | "traffic" | "autorpark";
type PlaygroundSidebarNavTag = "shared" | PlaygroundSidebarModeId;

type PlaygroundSidebarMode = {
  id: PlaygroundSidebarModeId;
  label: string;
  subtitle: string;
  avatarFallback: string;
  menuIcon: React.ElementType;
  navTag: PlaygroundSidebarNavTag;
};

type PlaygroundSidebarMenuItemBase = {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  tags?: PlaygroundSidebarNavTag[];
};

type PlaygroundSidebarMenuItem = PlaygroundSidebarMenuItemBase & {
  id: string;
  switchByTag?: Partial<Record<PlaygroundSidebarNavTag, Partial<PlaygroundSidebarMenuItemBase>>>;
};

type PlaygroundSidebarMenuCategoryBase = {
  label: string;
  items: PlaygroundSidebarMenuItem[];
  tags?: PlaygroundSidebarNavTag[];
};

type PlaygroundSidebarMenuCategory = PlaygroundSidebarMenuCategoryBase & {
  id: string;
  switchByTag?: Partial<
    Record<PlaygroundSidebarNavTag, Partial<PlaygroundSidebarMenuCategoryBase>>
  >;
};

type PlaygroundSidebarNavigationApi = {
  sharedTag: "shared";
  modes: PlaygroundSidebarMode[];
  categories: PlaygroundSidebarMenuCategory[];
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
      return <ChevronDown {...navIconProps} />;
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
    case "card":
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
    case "segmented-progress-bar":
      return <BarChart3 {...navIconProps} />;
    case "progress-circle":
      return <CircleGauge {...navIconProps} />;
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

function resolveByTag<T extends object>(
  base: T,
  switchByTag: Partial<Record<PlaygroundSidebarNavTag, Partial<T>>> | undefined,
  activeTags: PlaygroundSidebarNavTag[],
): T {
  let resolved = base;
  for (const tag of activeTags) {
    const patch = switchByTag?.[tag];
    if (patch !== undefined) {
      resolved = { ...resolved, ...patch };
    }
  }
  return resolved;
}

function isVisibleForTags(
  tags: PlaygroundSidebarNavTag[] | undefined,
  activeTagSet: ReadonlySet<PlaygroundSidebarNavTag>,
): boolean {
  if (tags === undefined || tags.length === 0) return true;
  return tags.some((tag) => activeTagSet.has(tag));
}

function buildSidebarNavigationApi(nav: PlaygroundNavModel): PlaygroundSidebarNavigationApi {
  const modes: PlaygroundSidebarMode[] = [
    {
      id: "crm",
      label: "CRM",
      subtitle: "Продажи и pipeline",
      avatarFallback: "CR",
      menuIcon: LayoutDashboard,
      navTag: "crm",
    },
    {
      id: "traffic",
      label: "Traffic",
      subtitle: "Кампании и аналитика",
      avatarFallback: "TR",
      menuIcon: Megaphone,
      navTag: "traffic",
    },
    {
      id: "autorpark",
      label: "Autorpark",
      subtitle: "Парк и обслуживание",
      avatarFallback: "AP",
      menuIcon: Car,
      navTag: "autorpark",
    },
  ];

  const sharedCategories: PlaygroundSidebarMenuCategory[] = [
    {
      id: "workspace",
      label: "Workspace",
      tags: ["shared"],
      switchByTag: {
        crm: { label: "CRM Workspace" },
        traffic: { label: "Traffic Workspace" },
        autorpark: { label: "Autorpark Workspace" },
      },
      items: [
        {
          id: "workspace-home",
          label: "Введение",
          to: "/",
          icon: <BookOpen {...navIconProps} />,
          tags: ["shared"],
        },
        {
          id: "workspace-primary",
          label: "Сделки",
          to: "/data-table",
          icon: <LayoutDashboard {...navIconProps} />,
          tags: ["shared"],
          switchByTag: {
            traffic: {
              label: "Кампании",
              to: "/progress-bar",
              icon: <Megaphone {...navIconProps} />,
            },
            autorpark: {
              label: "Автопарк",
              to: "/card",
              icon: <Car {...navIconProps} />,
            },
          },
        },
        {
          id: "workspace-alerts",
          label: "Оповещения",
          to: "/notification",
          icon: <Bell {...navIconProps} />,
          tags: ["shared"],
          switchByTag: {
            autorpark: {
              label: "ТО и сервис",
              to: "/datepicker",
              icon: <Calendar {...navIconProps} />,
            },
          },
        },
      ],
    },
  ];

  const crmCatalog: PlaygroundSidebarMenuCategory[] = nav.categories.map((category) => ({
    id: `crm-${category.id}`,
    label: category.label,
    tags: ["crm"],
    items: category.pages.map((page) => ({
      id: `crm-${category.id}-${page.segment}`,
      label: page.label,
      to: toRoute(page.segment),
      icon: pageIcon(page.segment),
      tags: ["crm"],
    })),
  }));

  const trafficCatalog: PlaygroundSidebarMenuCategory[] = [
    {
      id: "traffic-analytics",
      label: "Аналитика трафика",
      tags: ["traffic"],
      items: [
        {
          id: "traffic-dashboard",
          label: "Dashboard",
          to: "/progress-circle",
          icon: <CircleGauge {...navIconProps} />,
          tags: ["traffic"],
        },
        {
          id: "traffic-sources",
          label: "Источники",
          to: "/segmented-progress-bar",
          icon: <BarChart3 {...navIconProps} />,
          tags: ["traffic"],
        },
        {
          id: "traffic-rules",
          label: "Правила и теги",
          to: "/tag",
          icon: <Tag {...navIconProps} />,
          tags: ["traffic"],
        },
      ],
    },
  ];

  const autorparkCatalog: PlaygroundSidebarMenuCategory[] = [
    {
      id: "autorpark-fleet",
      label: "Парк",
      tags: ["autorpark"],
      items: [
        {
          id: "autorpark-cars",
          label: "Список авто",
          to: "/data-table",
          icon: <Car {...navIconProps} />,
          tags: ["autorpark"],
        },
        {
          id: "autorpark-cards",
          label: "Карточки машин",
          to: "/card",
          icon: <LayoutDashboard {...navIconProps} />,
          tags: ["autorpark"],
        },
        {
          id: "autorpark-maintenance",
          label: "План ТО",
          to: "/datepicker",
          icon: <Calendar {...navIconProps} />,
          tags: ["autorpark"],
        },
      ],
    },
  ];

  return {
    sharedTag: "shared",
    modes,
    categories: [...sharedCategories, ...crmCatalog, ...trafficCatalog, ...autorparkCatalog],
  };
}

function resolveSidebarNavigation(
  api: PlaygroundSidebarNavigationApi,
  modeId: PlaygroundSidebarModeId,
): { mode: PlaygroundSidebarMode; categories: ResolvedMenuCategory[] } {
  const mode = api.modes.find((entry) => entry.id === modeId) ?? api.modes[0];
  if (mode === undefined) {
    throw new Error("[playground] sidebar mode list is empty");
  }

  const activeTags: PlaygroundSidebarNavTag[] = [api.sharedTag, mode.navTag];
  const activeTagSet = new Set(activeTags);

  const categories = api.categories
    .filter((category) => isVisibleForTags(category.tags, activeTagSet))
    .map((category): ResolvedMenuCategory => {
      const resolvedCategory = resolveByTag<PlaygroundSidebarMenuCategoryBase>(
        {
          label: category.label,
          items: category.items,
          tags: category.tags,
        },
        category.switchByTag,
        activeTags,
      );

      const items = resolvedCategory.items
        .map((item): ResolvedMenuItem | null => {
          const resolvedItem = resolveByTag<PlaygroundSidebarMenuItemBase>(
            {
              label: item.label,
              to: item.to,
              icon: item.icon,
              onSelect: item.onSelect,
              tags: item.tags,
            },
            item.switchByTag,
            activeTags,
          );

          if (!isVisibleForTags(resolvedItem.tags, activeTagSet)) {
            return null;
          }

          return {
            id: item.id,
            label: resolvedItem.label,
            to: resolvedItem.to,
            icon: resolvedItem.icon,
            onSelect: resolvedItem.onSelect,
          };
        })
        .filter((item): item is ResolvedMenuItem => item !== null);

      return {
        id: category.id,
        label: resolvedCategory.label,
        items,
      };
    })
    .filter((category) => category.items.length > 0);

  return { mode, categories };
}

function modeAvatarClassName(modeId: PlaygroundSidebarModeId): string {
  switch (modeId) {
    case "crm":
      return "playgroundSidebarModeAvatarCrm";
    case "traffic":
      return "playgroundSidebarModeAvatarTraffic";
    case "autorpark":
      return "playgroundSidebarModeAvatarAutorpark";
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
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Sidebar.IdentityButton
          leading={
            <Avatar.Root size="m" className={modeAvatarClassName(mode.id)}>
              <Avatar.Fallback>{mode.avatarFallback}</Avatar.Fallback>
            </Avatar.Root>
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

function PlaygroundUserMenuContent() {
  return (
    <>
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
    </>
  );
}

function PlaygroundHeaderUserMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button
          type="button"
          className="playgroundSidebarUserTrigger"
          aria-label="Меню пользователя"
        >
          <Avatar.Root size="m">
            <Avatar.Fallback>ES</Avatar.Fallback>
          </Avatar.Root>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content align="end" side="bottom">
        <PlaygroundUserMenuContent />
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function PlaygroundFooterThemeSelectors() {
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
    <div className="playgroundSidebarFooterControls">
      <div className="playgroundSidebarFooterControl">
        <Sidebar.Text className="playgroundSidebarFooterLabel">Тема интерфейса</Sidebar.Text>
        <Select.Root value={scheme} onChange={onSchemeChange} size="m">
          <Select.Trigger aria-label="Схема темы playground">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="light">Светлая</Select.Item>
            <Select.Item value="dark">Тёмная</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <div className="playgroundSidebarFooterControl">
        <Sidebar.Text className="playgroundSidebarFooterLabel">Бренд-тема</Sidebar.Text>
        <Select.Root value={preset} onChange={onPresetChange} size="m">
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
  );
}

export function PlaygroundChromeSidebar() {
  const nav = React.useMemo(() => getPlaygroundNavModel(), []);
  const navigationApi = React.useMemo(() => buildSidebarNavigationApi(nav), [nav]);
  const [modeId, setModeId] = React.useState<PlaygroundSidebarModeId>("crm");

  const { mode, categories } = React.useMemo(
    () => resolveSidebarNavigation(navigationApi, modeId),
    [navigationApi, modeId],
  );

  return (
    <Sidebar.Root sidebarSlot="page-nav" aria-label="Навигация playground">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <PlaygroundModeSwitcher
                mode={mode}
                modes={navigationApi.modes}
                onModeChange={setModeId}
              />
            </Sidebar.HeaderMain>
            <PlaygroundHeaderUserMenu />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.ToggleButton placement="edge" />

        <Tooltip.Provider delayDuration={0}>
          <Sidebar.Content>
            <PlaygroundTreeMenu categories={categories} />
          </Sidebar.Content>
        </Tooltip.Provider>

        <Sidebar.Footer variant="inset">
          <PlaygroundFooterThemeSelectors />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
