import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { getPanelOffsetPx, getViewportPadPx } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";

import styles from "./Tooltip.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSide = "top" | "bottom" | "left" | "right";

// ─── Provider Context ─────────────────────────────────────────────────────────

type TooltipProviderContextValue = {
  delayDuration: number;
};

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 400,
});

// ─── Root Context ─────────────────────────────────────────────────────────────

type TooltipRootContextValue = {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  handleOpen: () => void;
  handleClose: () => void;
};

const [TooltipRootProvider, useTooltipRootContext] =
  createComponentContext<TooltipRootContextValue>("Tooltip");

// ─── Provider ─────────────────────────────────────────────────────────────────

export type TooltipProviderProps = {
  delayDuration?: number;
  children: React.ReactNode;
};

function TooltipProvider({ delayDuration = 400, children }: TooltipProviderProps) {
  const value = React.useMemo(() => ({ delayDuration }), [delayDuration]);
  return (
    <TooltipProviderContext.Provider value={value}>{children}</TooltipProviderContext.Provider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TooltipRootProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Задержка показа (мс) для этого тултипа; по умолчанию — из `Tooltip.Provider` (400). */
  delayDuration?: number;
};

function TooltipRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration: delayProp,
}: TooltipRootProps) {
  const providerDelay = React.useContext(TooltipProviderContext).delayDuration;
  const delayDuration = delayProp ?? providerDelay;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentId = React.useId();

  const handleOpen = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), delayDuration);
  }, [delayDuration, setIsOpen]);

  const handleClose = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  }, [setIsOpen]);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  /* WAI-ARIA tooltip: Escape скрывает подсказку, фокус остаётся на триггере. */
  useEscapeKey({ enabled: isOpen, onEscape: handleClose });

  return (
    <TooltipRootProvider value={{ isOpen, triggerRef, contentId, handleOpen, handleClose }}>
      {children}
    </TooltipRootProvider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type TooltipTriggerProps = {
  children: React.ReactElement;
  className?: string;
};

function TooltipTrigger({ children, className }: TooltipTriggerProps) {
  const { isOpen, triggerRef, contentId, handleOpen, handleClose } = useTooltipRootContext();
  const props = children.props as React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<HTMLElement>;
  };

  return React.cloneElement(
    children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >,
    {
      ref: triggerRef,
      className: cx(props.className, className) || undefined,
      "aria-describedby":
        [props["aria-describedby"], isOpen ? contentId : undefined].filter(Boolean).join(" ") ||
        undefined,
      ...toDataAttributes({ state: isOpen ? "open" : "closed" }),
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        props.onMouseEnter?.(e);
        handleOpen();
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        props.onMouseLeave?.(e);
        handleClose();
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        props.onFocus?.(e);
        handleOpen();
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        props.onBlur?.(e);
        handleClose();
      },
    },
  );
}

// ─── Positioning ──────────────────────────────────────────────────────────────

type TooltipCoords = { top: number; left: number; side: TooltipSide };

const OPPOSITE: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Позиция по стороне; если не влезает — противоположная сторона; затем сдвиг в пределах вьюпорта. */
export function computeTooltipPosition(
  ar: Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "width" | "height">,
  cw: number,
  ch: number,
  vw: number,
  vh: number,
  side: TooltipSide,
  offset: number,
  pad: number,
): TooltipCoords {
  const place = (s: TooltipSide) => {
    switch (s) {
      case "top":
        return { top: ar.top - ch - offset, left: ar.left + ar.width / 2 - cw / 2 };
      case "bottom":
        return { top: ar.bottom + offset, left: ar.left + ar.width / 2 - cw / 2 };
      case "left":
        return { top: ar.top + ar.height / 2 - ch / 2, left: ar.left - cw - offset };
      case "right":
        return { top: ar.top + ar.height / 2 - ch / 2, left: ar.right + offset };
    }
  };
  const fits = (s: TooltipSide, p: { top: number; left: number }) =>
    s === "top" || s === "bottom"
      ? p.top >= pad && p.top + ch <= vh - pad
      : p.left >= pad && p.left + cw <= vw - pad;

  let resolved = side;
  let pos = place(side);
  if (!fits(side, pos)) {
    const alt = OPPOSITE[side];
    const altPos = place(alt);
    if (fits(alt, altPos)) {
      resolved = alt;
      pos = altPos;
    }
  }

  return {
    top: Math.round(Math.max(pad, Math.min(pos.top, vh - ch - pad))),
    left: Math.round(Math.max(pad, Math.min(pos.left, vw - cw - pad))),
    side: resolved,
  };
}

// ─── Content ─────────────────────────────────────────────────────────────────

export type TooltipContentProps = {
  children: React.ReactNode;
  size?: ControlSize;
  side?: TooltipSide;
  className?: string;
};

function TooltipContent({ children, size = "m", side = "top", className }: TooltipContentProps) {
  const { isOpen, triggerRef, contentId } = useTooltipRootContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = React.useState<TooltipCoords | null>(null);
  // Pointer-leave / blur / Escape close it with the shared fade-out (Overlay contract).
  const presence = usePresence(isOpen, { exitDuration: "fast" });
  const mounted = presence.mounted;

  React.useEffect(() => {
    if (!mounted) {
      setCoords(null);
      return;
    }

    const update = () => {
      const anchor = triggerRef.current;
      const content = contentRef.current;
      if (!anchor || !content) return;
      const cr = content.getBoundingClientRect();
      setCoords(
        computeTooltipPosition(
          anchor.getBoundingClientRect(),
          cr.width,
          cr.height,
          window.innerWidth,
          window.innerHeight,
          side,
          getPanelOffsetPx(),
          getViewportPadPx(),
        ),
      );
    };

    const frameId = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [mounted, triggerRef, side]);

  if (!mounted) return null;

  const positionStyle: React.CSSProperties = {
    position: "fixed",
    top: coords?.top ?? 0,
    left: coords?.left ?? 0,
  };

  return (
    <Portal>
      <div
        ref={contentRef}
        id={contentId}
        role="tooltip"
        data-overlay-portal-layer={overlayPortalLayer}
        className={cx(styles.content, overlayMotion.floating, className)}
        style={positionStyle}
        onAnimationEnd={presence.onExitEnd}
        {...toDataAttributes({
          state: presence.state,
          size,
          /* Resolved side: flips to the opposite one when the requested side does not fit. */
          side: coords?.side ?? side,
          /* До первого измерения прозрачен (CSS), чтобы не мигать в (0, 0). */
          positioned: coords ? true : undefined,
        })}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </div>
    </Portal>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

TooltipProvider.displayName = "Tooltip.Provider";
TooltipRoot.displayName = "Tooltip.Root";
TooltipTrigger.displayName = "Tooltip.Trigger";
TooltipContent.displayName = "Tooltip.Content";

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
