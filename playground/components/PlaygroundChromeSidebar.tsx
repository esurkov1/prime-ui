import { Check, Moon, Search, Square, SquareStack, Sun } from "lucide-react";
import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { Dropdown } from "@/components/dropdown/Dropdown";
import { Kbd } from "@/components/kbd/Kbd";
import { Sidebar, useSidebar } from "@/layout";

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

/** Reports the Sidebar's own off-canvas state, so the layout uses the kit breakpoint, not a copy. */
function OffCanvasReporter({ onChange }: { onChange: (offCanvas: boolean) => void }) {
  const { offCanvas } = useSidebar();
  React.useLayoutEffect(() => onChange(offCanvas), [offCanvas, onChange]);
  return null;
}

export type PlaygroundChromeSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
  /** Called with `true` while the sidebar is an off-canvas panel (narrow viewport). */
  onOffCanvasChange: (offCanvas: boolean) => void;
};

/**
 * Playground navigation built from the kit: brand header, search, collapsible categories, footer.
 * The rail mode and the folded categories are uncontrolled and remembered (`persistKey`), so a
 * toggle re-renders only what reads the sidebar context — never this tree or the page.
 */
export function PlaygroundChromeSidebar({
  open,
  onOpenChange,
  onSearch,
  onOffCanvasChange,
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
      persistKey="prime-playground-sidebar"
      open={open}
      onOpenChange={onOpenChange}
      labels={{ navigation: "Навигация playground" }}
    >
      <OffCanvasReporter onChange={onOffCanvasChange} />
      <Sidebar.Header>
        <Brand />
        <Sidebar.Toggle variant="header" />
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
          <Kbd>{isMac ? "⌘K" : "Ctrl K"}</Kbd>
        </Sidebar.ItemShortcut>
      </Sidebar.Item>
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
