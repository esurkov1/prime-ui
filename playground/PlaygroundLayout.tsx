import { Menu, Search } from "lucide-react";
import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/button/Button";
import { Typography } from "@/components/typography/Typography";
import { AppShell } from "@/layout";

import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";
import { PlaygroundSearch, usePlaygroundSearchHotkey } from "./components/PlaygroundSearch";
import { PLAYGROUND_PAGES, pageRoute } from "./playgroundPages";

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
  const [navOpen, setNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const narrow = useNarrowViewport();

  usePlaygroundSearchHotkey(setSearchOpen);

  const page = PLAYGROUND_PAGES.find((p) => pageRoute(p.segment) === pathname);

  return (
    <>
      <AppShell.Template
        fillViewport
        scrollResetKey={pathname}
        mainProps={{ id: "playground-main", tabIndex: -1 }}
        nav={
          /* The sidebar owns its mode: toggling it re-renders the rail, not the page. */
          <PlaygroundChromeSidebar
            open={navOpen}
            onOpenChange={setNavOpen}
            onSearch={() => setSearchOpen(true)}
          />
        }
        header={
          narrow ? (
            <div className="playgroundMobileBar">
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
            </div>
          ) : null
        }
      >
        <Outlet />
      </AppShell.Template>
      <PlaygroundSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
