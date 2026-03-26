import type * as React from "react";

import { createComponentContext } from "@/internal/context";
import type { SidebarSize } from "@/internal/states";

export type SidebarContextValue = {
  size: SidebarSize;
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleOpen: () => void;
  /** Стабильный id для `NavPanel` — `aria-controls` у кнопок открытия. */
  navPanelId: string;
  /**
   * Уход с `NavPanel`: при открытии «с края» (peek) закрывает сайдбар;
   * явное открытие кнопкой не закрывается по уходу.
   */
  notifyNavPanelPeekLeave: (event: React.PointerEvent<Element> | React.MouseEvent<Element>) => void;
};

const [SidebarProvider, useSidebarContext] = createComponentContext<SidebarContextValue>("Sidebar");

export { SidebarProvider, useSidebarContext };
