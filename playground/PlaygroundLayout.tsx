import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { AppShell } from "@/layout";

import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";

export function PlaygroundLayout() {
  const { pathname } = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: сброс прокрутки колонки при смене pathname
  React.useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AppShell.Template
      fillViewport
      nav={<PlaygroundChromeSidebar />}
      ref={mainRef}
      mainProps={{
        id: "playground-main",
        variant: "page",
        tabIndex: -1,
      }}
    >
      <Outlet />
    </AppShell.Template>
  );
}
