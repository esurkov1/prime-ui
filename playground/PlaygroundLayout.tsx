import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { AppHeader, AppShell } from "@/layout";

import { PLAYGROUND_NAV_CATEGORIES } from "./categories";
import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";
import { PlaygroundHeaderControls } from "./components/PlaygroundHeaderControls";
import { PlaygroundSearch, usePlaygroundSearchHotkey } from "./components/PlaygroundSearch";
import { PLAYGROUND_INTRO, PLAYGROUND_PAGES, pageRoute } from "./playgroundPages";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function PlaygroundLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  usePlaygroundSearchHotkey(setSearchOpen);

  const page = PLAYGROUND_PAGES.find((p) => pageRoute(p.segment) === pathname) ?? PLAYGROUND_INTRO;
  const category = PLAYGROUND_NAV_CATEGORIES.find((c) => c.id === page.category);

  return (
    <>
      <AppShell.Template
        fillViewport
        scrollResetKey={pathname}
        mainProps={{ id: "playground-main", tabIndex: -1 }}
        nav={
          /* The sidebar owns its mode: toggling it re-renders the rail, not the page. */
          <PlaygroundChromeSidebar open={navOpen} onOpenChange={setNavOpen} />
        }
        header={
          <AppHeader.Root>
            <AppHeader.Start>
              <AppHeader.MenuButton aria-expanded={navOpen} onClick={() => setNavOpen(true)} />
              {/* Where you are, not a second title: the page heading is the h1 below. */}
              <Breadcrumb.Root>
                {category ? <Breadcrumb.Item>{category.label}</Breadcrumb.Item> : null}
                <Breadcrumb.Item current>{page.label}</Breadcrumb.Item>
              </Breadcrumb.Root>
            </AppHeader.Start>
            <AppHeader.Search
              aria-haspopup="dialog"
              shortcut={isMac ? "⌘K" : "Ctrl K"}
              onClick={() => setSearchOpen(true)}
            >
              Поиск по компонентам
            </AppHeader.Search>
            <AppHeader.Actions>
              <PlaygroundHeaderControls />
            </AppHeader.Actions>
          </AppHeader.Root>
        }
      >
        <Outlet />
      </AppShell.Template>
      <PlaygroundSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
