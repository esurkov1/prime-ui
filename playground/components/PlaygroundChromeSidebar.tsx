import { Check, Moon, Square, SquareStack, Sun } from "lucide-react";
import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { Dropdown } from "@/components/dropdown/Dropdown";
import { Sidebar } from "@/layout";

import {
  PLAYGROUND_INTRO,
  PLAYGROUND_NAV,
  type PlaygroundPageEntry,
  pageRoute,
} from "../playgroundPages";
import { PLAYGROUND_PREVIEW_SURFACES, usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

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
    <Sidebar.Brand asChild description="Graphite · playground">
      <Link to="/" aria-label="Prime UI — на главную">
        <Sidebar.BrandLogo>
          <span className="playgroundBrandMark">
            <span />
            <span />
            <span />
            <span />
          </span>
        </Sidebar.BrandLogo>
        Prime UI
      </Link>
    </Sidebar.Brand>
  );
}

/** Footer rows: the theme switch and the preview surface menu, item-shaped like the rest. */
function FooterControls() {
  const { scheme, toggleScheme } = usePlaygroundTheme();
  const { surface, setSurface } = usePlaygroundPreviewTheme();
  const isDark = scheme === "dark";
  const active =
    PLAYGROUND_PREVIEW_SURFACES.find((s) => s.value === surface) ?? PLAYGROUND_PREVIEW_SURFACES[0];

  return (
    <>
      <Sidebar.Item onClick={toggleScheme}>
        <Sidebar.ItemIcon>{isDark ? <Sun /> : <Moon />}</Sidebar.ItemIcon>
        {isDark ? "Светлая тема" : "Тёмная тема"}
      </Sidebar.Item>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <SquareStack />
            </Sidebar.ItemIcon>
            Фон превью
            <Sidebar.ItemCount>{active.label}</Sidebar.ItemCount>
          </Sidebar.Item>
        </Dropdown.Trigger>
        <Dropdown.Content align="start" side="top">
          <Dropdown.Group label="Фон превью">
            {PLAYGROUND_PREVIEW_SURFACES.map((entry) => (
              <Dropdown.Item key={entry.value} onSelect={() => setSurface(entry.value)}>
                <Dropdown.ItemIcon>
                  {entry.value === surface ? <Check strokeWidth={2} /> : <Square strokeWidth={2} />}
                </Dropdown.ItemIcon>
                {entry.label} — {entry.hint.toLowerCase()}
              </Dropdown.Item>
            ))}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}

export type PlaygroundChromeSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Playground navigation built from the kit: brand header, collapsible categories, footer (search
 * lives in the AppHeader).
 * The rail mode and the folded categories are uncontrolled and remembered (`persistKey`), so a
 * toggle re-renders only what reads the sidebar context — never this tree or the page.
 */
export function PlaygroundChromeSidebar({ open, onOpenChange }: PlaygroundChromeSidebarProps) {
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
      persistKey="prime-playground-sidebar"
      open={open}
      onOpenChange={onOpenChange}
      labels={{ navigation: "Навигация playground" }}
    >
      <Sidebar.Header>
        <Brand />
        <Sidebar.Toggle variant="header" />
      </Sidebar.Header>
      <Sidebar.Content ref={contentRef}>
        <Sidebar.Group>
          <PageItem page={PLAYGROUND_INTRO} />
        </Sidebar.Group>
        {PLAYGROUND_NAV.map((category) => (
          <Sidebar.Group key={category.id} label={category.label} collapsible>
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
