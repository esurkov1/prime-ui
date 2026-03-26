import type * as React from "react";
import type { ReactNode } from "react";

import { createComponentContext } from "@/internal/context";
import type { SidebarSize } from "@/internal/states";

export type SidebarVariant = "simple" | "double";

export type SidebarContextItem = {
  id: string;
  label: string;
  icon: ReactNode;
  tooltip?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

export type SidebarContextValue = {
  size: SidebarSize;
  variant: SidebarVariant;
  setVariant: (next: SidebarVariant) => void;
  activeSection: string | null;
  setActiveSection: (id: string) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  toggleOpen: () => void;
  /** Стабильный id для `NavPanel` — `aria-controls` у кнопок открытия. */
  navPanelId: string;
  /**
   * Уход с `NavPanel`: при открытии «с края» (peek) закрывает сайдбар;
   * не закрывает при переходе на `ContextBar` (двухъярусный вариант).
   */
  notifyNavPanelPeekLeave: (event: React.PointerEvent<Element> | React.MouseEvent<Element>) => void;
};

const [SidebarProvider, useSidebarContext] = createComponentContext<SidebarContextValue>("Sidebar");

export { SidebarProvider, useSidebarContext };

/**
 * Собирает `to` для пунктов панели при `variant="double"` (префикс `activeSection`).
 */
export function useSidebarNavTo(pathWithinSection: string): string {
  const { variant, activeSection } = useSidebarContext();
  const inner = pathWithinSection.replace(/^\/+|\/+$/g, "");
  if (variant === "double" && activeSection !== null && activeSection !== "") {
    if (inner === "") {
      return `/${activeSection}`;
    }
    return `/${activeSection}/${inner}`;
  }
  if (inner === "") {
    return "/";
  }
  return `/${inner}`;
}
