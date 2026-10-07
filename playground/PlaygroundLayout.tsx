import { Menu, Search } from "lucide-react";
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/button/Button";
import { Typography } from "@/components/typography/Typography";
import { AppShell, type SidebarMode } from "@/layout";

import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";
import { PlaygroundSearch, usePlaygroundSearchHotkey } from "./components/PlaygroundSearch";
import { PLAYGROUND_PAGES, pageRoute } from "./playgroundPages";

const MODE_KEY = "prime-playground-sidebar-mode";

function readMode(): SidebarMode {
  try {
    const value = window.localStorage.getItem(MODE_KEY);
    return value === "compact" ? "compact" : "expanded";
  } catch {
    return "expanded";
  }
}

const NARROW = "(max-width: 767.98px)";

/** Whether the viewport is narrow enough for the off-canvas sidebar (the AppShell breakpoint). */
function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(NARROW).matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return narrow;
}

export function PlaygroundLayout() {
  const { pathname } = useLocation();
  const [mode, setModeState] = React.useState<SidebarMode>(readMode);
  const [navOpen, setNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const mainRef = React.useRef<HTMLElement>(null);
  const narrow = useNarrowViewport();

  usePlaygroundSearchHotkey(setSearchOpen);

  const setMode = React.useCallback((next: SidebarMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {
      // Storage unavailable: the mode lives for this session only.
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top on route change
  React.useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  const page = PLAYGROUND_PAGES.find((p) => pageRoute(p.segment) === pathname);

  return (
    <>
      <AppShell.Root fillViewport>
        <AppShell.Nav>
          <PlaygroundChromeSidebar
            mode={mode}
            onModeChange={setMode}
            open={navOpen}
            onOpenChange={setNavOpen}
            onSearch={() => setSearchOpen(true)}
          />
        </AppShell.Nav>
        {narrow ? (
          <AppShell.Header className="playgroundMobileBar">
            <Button.Root
              variant="ghost"
              tone="neutral"
              aria-label="Открыть навигацию"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <Button.Icon>
                <Menu />
              </Button.Icon>
            </Button.Root>
            <Typography as="span" variant="title-m" truncate className="playgroundMobileTitle">
              {page?.label ?? "Prime UI"}
            </Typography>
            <Button.Root
              variant="ghost"
              tone="neutral"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
            >
              <Button.Icon>
                <Search />
              </Button.Icon>
            </Button.Root>
          </AppShell.Header>
        ) : null}
        <AppShell.Main ref={mainRef} id="playground-main" tabIndex={-1}>
          <Outlet />
        </AppShell.Main>
      </AppShell.Root>
      <PlaygroundSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
