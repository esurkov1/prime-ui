import { Outlet } from "react-router-dom";

import { AppShell } from "@/layout";

import { PlaygroundChromeSidebar } from "./components/PlaygroundChromeSidebar";

export function PlaygroundLayout() {
  return (
    <AppShell.Template
      fillViewport
      nav={<PlaygroundChromeSidebar />}
      mainProps={{
        id: "playground-main",
        tabIndex: -1,
      }}
    >
      <Outlet />
    </AppShell.Template>
  );
}
