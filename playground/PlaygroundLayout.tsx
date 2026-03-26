import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { PageShell } from "@/components/page-shell/PageShell";

import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";

export function PlaygroundLayout() {
  const { pathname } = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: сброс прокрутки колонки при смене pathname
  React.useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PageShell.Application
      fillViewport
      className="playgroundShell"
      nav={<PlaygroundChromeSidebar />}
      ref={mainRef}
      contentProps={{
        id: "playground-main",
        className: "playgroundMain",
        tabIndex: -1,
      }}
    >
      <Outlet />
    </PageShell.Application>
  );
}
