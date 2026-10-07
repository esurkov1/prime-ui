import {
  Check,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Square,
  SquareStack,
  Sun,
} from "lucide-react";
import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Kbd } from "@/components/kbd/Kbd";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { Typography } from "@/components/typography/Typography";
import { Sidebar, type SidebarMode, useSidebar } from "@/layout";

import {
  PLAYGROUND_INTRO,
  PLAYGROUND_NAV,
  type PlaygroundPageEntry,
  pageRoute,
} from "../playgroundPages";
import { PLAYGROUND_PREVIEW_SURFACES, usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function PageItem({ page }: { page: PlaygroundPageEntry }) {
  const Icon = page.icon;
  return (
    <Sidebar.Item asChild>
      <NavLink to={pageRoute(page.segment)} end={page.segment === ""}>
        <Sidebar.ItemIcon>
          <Icon />
        </Sidebar.ItemIcon>
        {page.label}
      </NavLink>
    </Sidebar.Item>
  );
}

function Brand() {
  return (
    <Link to="/" className="playgroundBrand" aria-label="Prime UI — на главную">
      <span className="playgroundBrandMark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="playgroundBrandText">
        <Typography.Root as="span" variant="title-s">
          Prime UI
        </Typography.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          Graphite · playground
        </Typography.Root>
      </span>
    </Link>
  );
}

/**
 * Tooltip on a wrapper: the tooltip and the dropdown trigger both need the button's ref, so the
 * tooltip anchors to the span around it.
 */
function FooterTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <span className="playgroundSidebarFooterTip">{children}</span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

function FooterButton({
  label,
  icon,
  ...rest
}: Omit<React.ComponentPropsWithRef<"button">, "children"> & {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button.Root {...rest} variant="ghost" tone="neutral" aria-label={label}>
      <Button.Icon>{icon}</Button.Icon>
    </Button.Root>
  );
}

/** One row at the bottom of the rail: collapse, theme, preview surface. Stacks in compact mode. */
function FooterControls() {
  const { mode, isMobile, open, toggle, navId, labels } = useSidebar();
  const { scheme, toggleScheme } = usePlaygroundTheme();
  const { surface, setSurface } = usePlaygroundPreviewTheme();
  const isDark = scheme === "dark";
  const expanded = isMobile ? open : mode === "expanded";
  const toggleLabel = isMobile ? labels.close : expanded ? labels.collapse : labels.expand;
  const themeLabel = isDark ? "Светлая тема" : "Тёмная тема";
  const active =
    PLAYGROUND_PREVIEW_SURFACES.find((s) => s.value === surface) ?? PLAYGROUND_PREVIEW_SURFACES[0];
  const surfaceLabel = `Фон превью: ${active.label}`;

  return (
    <div className="playgroundSidebarFooter">
      <FooterTip label={toggleLabel}>
        <FooterButton
          label={toggleLabel}
          icon={expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
          aria-expanded={expanded}
          aria-controls={navId}
          onClick={toggle}
        />
      </FooterTip>
      <FooterTip label={themeLabel}>
        <FooterButton
          label={themeLabel}
          icon={isDark ? <Sun /> : <Moon />}
          onClick={toggleScheme}
        />
      </FooterTip>
      <FooterTip label={surfaceLabel}>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <FooterButton label={surfaceLabel} icon={<SquareStack />} />
          </Dropdown.Trigger>
          <Dropdown.Content align="start" side="top">
            <Dropdown.Group>
              <Dropdown.GroupLabel>Фон превью</Dropdown.GroupLabel>
              {PLAYGROUND_PREVIEW_SURFACES.map((entry) => (
                <Dropdown.Item key={entry.value} onSelect={() => setSurface(entry.value)}>
                  <Dropdown.ItemIcon
                    as={entry.value === surface ? Check : Square}
                    size={16}
                    strokeWidth={2}
                  />
                  {entry.label} — {entry.hint.toLowerCase()}
                </Dropdown.Item>
              ))}
            </Dropdown.Group>
          </Dropdown.Content>
        </Dropdown.Root>
      </FooterTip>
    </div>
  );
}

export type PlaygroundChromeSidebarProps = {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
};

/** Playground navigation built from the kit: Sidebar m, groups = categories, search, footer controls. */
export function PlaygroundChromeSidebar({
  mode,
  onModeChange,
  open,
  onOpenChange,
  onSearch,
}: PlaygroundChromeSidebarProps) {
  const { pathname } = useLocation();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: keep the current page in view on route change
  React.useLayoutEffect(() => {
    contentRef.current
      ?.querySelector<HTMLElement>("[aria-current='page']")
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <Sidebar.Root
      mode={mode}
      onModeChange={onModeChange}
      open={open}
      onOpenChange={onOpenChange}
      labels={{ navigation: "Навигация playground" }}
    >
      <Sidebar.Header>
        <Brand />
      </Sidebar.Header>
      <Sidebar.Item
        aria-haspopup="dialog"
        onClick={() => {
          onOpenChange(false);
          onSearch();
        }}
      >
        <Sidebar.ItemIcon>
          <Search />
        </Sidebar.ItemIcon>
        Поиск
        <Sidebar.ItemShortcut>
          <Kbd.Root>{isMac ? "⌘K" : "Ctrl K"}</Kbd.Root>
        </Sidebar.ItemShortcut>
      </Sidebar.Item>
      <Sidebar.Content ref={contentRef}>
        <Sidebar.Group>
          <PageItem page={PLAYGROUND_INTRO} />
        </Sidebar.Group>
        {PLAYGROUND_NAV.map((category) => (
          <Sidebar.Group key={category.id} label={category.label}>
            {category.pages.map((page) => (
              <PageItem key={page.segment} page={page} />
            ))}
          </Sidebar.Group>
        ))}
      </Sidebar.Content>
      <Sidebar.Footer>
        <FooterControls />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
