import { createComponentContext } from "@/internal/context";
import type { SidebarSize } from "@/internal/states";
import type { SidebarLayoutMode } from "./sidebarLayout";

export type SidebarSide = "left" | "right";

export type SidebarContextValue = {
  size: SidebarSize;
  side: SidebarSide;
  state: SidebarLayoutMode;
  setState: (mode: SidebarLayoutMode) => void;
  mode: SidebarLayoutMode;
  setMode: (mode: SidebarLayoutMode) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleOpen: () => void;
  isMobile: boolean;
  navPanelId: string;
};

const [SidebarProvider, useSidebarContext] = createComponentContext<SidebarContextValue>("Sidebar");

export { SidebarProvider, useSidebarContext };
