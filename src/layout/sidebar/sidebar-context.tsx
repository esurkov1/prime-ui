import type * as React from "react";

import { createComponentContext } from "@/internal/context";
import type { SidebarSize } from "@/internal/states";
import type { SidebarLayoutMode } from "./sidebarLayout";

export type SidebarContextValue = {
  size: SidebarSize;
  mode: SidebarLayoutMode;
  setMode: (mode: SidebarLayoutMode) => void;
  /** Есть видимая панель: `compact` или `expand`. */
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleOpen: () => void;
  /** Стабильный id для `NavPanel` — `aria-controls` у кнопок открытия. */
  navPanelId: string;
};

const [SidebarProvider, useSidebarContext] = createComponentContext<SidebarContextValue>("Sidebar");

export { SidebarProvider, useSidebarContext };
