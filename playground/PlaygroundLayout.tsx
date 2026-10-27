import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { AppShell } from "@/layout";

import { PLAYGROUND_NAV_CATEGORIES } from "./categories";
import { PlaygroundChromeProvider } from "./components/PlaygroundChrome";
import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";
import { PlaygroundSearch, usePlaygroundSearchHotkey } from "./components/PlaygroundSearch";
import { PLAYGROUND_INTRO, PLAYGROUND_PAGES, pageRoute } from "./playgroundPages";

export function PlaygroundLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  usePlaygroundSearchHotkey(setSearchOpen);

  const page = PLAYGROUND_PAGES.find((p) => pageRoute(p.segment) === pathname) ?? PLAYGROUND_INTRO;
  const category = PLAYGROUND_NAV_CATEGORIES.find((c) => c.id === page.category);
  const chrome = React.useMemo(
    () => ({ category: category?.label, page: page.label, openSearch: () => setSearchOpen(true) }),
    [category?.label, page.label],
  );

  return (
    <PlaygroundChromeProvider value={chrome}>
      <AppShell.Template
        scrollResetKey={pathname}
        mainProps={{ id: "playground-main", tabIndex: -1 }}
        nav={
          /* The sidebar owns its mode: toggling it re-renders the rail, not the page. */
          <PlaygroundChromeSidebar open={navOpen} onOpenChange={setNavOpen} />
        }
      >
        <Outlet />
      </AppShell.Template>
      <PlaygroundSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </PlaygroundChromeProvider>
  );
}
