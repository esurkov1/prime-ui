import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useResizeEffect } from "@/hooks/useElementSize";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconSlotClass } from "@/internal/iconBox";
import press from "@/internal/press.module.css";
import { SwitcherScroller } from "@/internal/SwitcherScroller";
import {
  endIndicatorGlide,
  placeIndicator,
  selectionIndicatorClass,
} from "@/internal/selectionIndicator";
import { Slot } from "@/internal/slot";
import type { PaletteColor, Variant } from "@/internal/states";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./BottomNav.module.css";

export type BottomNavLabels = {
  /** `aria-label` of the `<nav>` landmark. */
  nav: string;
};

export const BOTTOM_NAV_LABELS: BottomNavLabels = {
  nav: "Основные разделы",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

type BottomNavLook = { iconOnly: boolean; floating: boolean };

/** Labels stay in the DOM in `iconOnly`: they name the items for assistive tech. */
const LookContext = React.createContext<BottomNavLook>({ iconOnly: false, floating: false });

export type BottomNavRootProps = React.HTMLAttributes<HTMLElement> & {
  /** Icons without visible labels; the labels still name the items for screen readers. */
  iconOnly?: boolean;
  /**
   * A glass capsule floating over the content (backdrop blur, inset from the edges) instead of
   * a flat bar at the edge, with a selection capsule that glides to the current item. It places
   * itself at the bottom of its positioned container (`AppShell.Footer`), so the page scrolls
   * under it.
   */
  floating?: boolean;
  labels?: Partial<BottomNavLabels>;
  /** The `<nav>`. */
  ref?: React.Ref<HTMLElement>;
};

/**
 * Puts the selection capsule (the shared selection indicator) under the current item. It glides
 * when the current item changes (a person's choice) and snaps on a layout change (resize, fonts,
 * new items).
 */
function syncSelection(track: HTMLElement, selection: HTMLElement, animate: boolean) {
  const current = track.querySelector<HTMLElement>('[aria-current="page"]');
  placeIndicator(selection, current, animate && !prefersReducedMotion());
}

/** Actions before the first item stand at the start of the bar, the rest at its end. */
function splitRootChildren(children: React.ReactNode) {
  const start: React.ReactNode[] = [];
  const items: React.ReactNode[] = [];
  const end: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === BottomNavAction) {
      (items.length === 0 ? start : end).push(child);
    } else {
      items.push(child);
    }
  });
  return { start, items, end };
}

/**
 * Phone navigation: a bar of 2–6 sections at the bottom of the screen, optionally with a round
 * action beside it. Inside `AppShell.Footer` it shows only while the Sidebar rail is off screen;
 * once the rail is on screen, Sidebar navigates.
 */
function BottomNavRoot({
  iconOnly = false,
  floating = false,
  labels,
  className,
  children,
  ...rest
}: BottomNavRootProps) {
  const trackRef = React.useRef<HTMLElement>(null);
  const selectionRef = React.useRef<HTMLSpanElement>(null);
  const { start, items, end } = splitRootChildren(children);
  const look = React.useMemo(() => ({ iconOnly, floating }), [iconOnly, floating]);

  // The current item can change outside this render (a router link sets `aria-current` itself),
  // so the capsule follows the attribute, not the props.
  React.useLayoutEffect(() => {
    const track = trackRef.current;
    const selection = selectionRef.current;
    if (!floating || !track || !selection) return;
    syncSelection(track, selection, false);
    const mutation = new MutationObserver(() => syncSelection(track, selection, true));
    mutation.observe(track, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-current"],
    });
    return () => mutation.disconnect();
  }, [floating]);

  useResizeEffect(
    trackRef,
    () => {
      const track = trackRef.current;
      const selection = selectionRef.current;
      if (track && selection) syncSelection(track, selection, false);
    },
    { enabled: floating, children: true },
  );

  return (
    <LookContext.Provider value={look}>
      <nav
        aria-label={labels?.nav ?? BOTTOM_NAV_LABELS.nav}
        {...rest}
        className={cx(styles.root, className)}
        {...toDataAttributes({
          "icon-only": iconOnly || undefined,
          floating: floating || undefined,
        })}
      >
        {start}
        {/* The bar is the surface (the flat edge or the glass capsule); the items scroll inside it
            as a switcher when they do not fit, never squeezed or cut. */}
        <div className={styles.bar}>
          <SwitcherScroller ref={trackRef} className={styles.track}>
            {floating ? (
              <span
                ref={selectionRef}
                className={cx(selectionIndicatorClass, styles.selection)}
                aria-hidden="true"
                onTransitionEnd={endIndicatorGlide}
              />
            ) : null}
            {items}
          </SwitcherScroller>
        </div>
        {end}
      </nav>
    </LookContext.Provider>
  );
}
BottomNavRoot.displayName = "BottomNav.Root";

// ─── Action ───────────────────────────────────────────────────────────────────

export type BottomNavActionProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  /** The glyph, e.g. `<Icon name="action.add" />`. */
  children: React.ReactNode;
  /** The action has no visible text: `aria-label` names it. */
  "aria-label": string;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A round button beside the bar for the screen's main action (create, search, assistant): a
 * `Button shape="circle"` (`l`, neutral) — in a flat bar a solid disk at its edge, in `floating` a
 * Button `glass` disk as tall as the capsule (the bar gives it its height); the bar draws the rim
 * and the lift around it.
 */
function BottomNavAction({ className, children, ...rest }: BottomNavActionProps) {
  const { floating } = React.useContext(LookContext);
  return (
    <Button.Root
      {...rest}
      shape="circle"
      size="l"
      variant={floating ? "glass" : "solid"}
      tone="neutral"
      className={cx(styles.action, className)}
    >
      <Button.Icon>{children}</Button.Icon>
    </Button.Root>
  );
}
BottomNavAction.displayName = "BottomNav.Action";

// ─── Item parts ───────────────────────────────────────────────────────────────

export type BottomNavItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The item glyph above the label. */
function BottomNavItemIcon({ className, ...rest }: BottomNavItemIconProps) {
  return (
    <span {...rest} className={cx(iconSlotClass, styles.icon, className)} aria-hidden="true" />
  );
}
BottomNavItemIcon.displayName = "BottomNav.ItemIcon";

export type BottomNavItemCountProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  /** The number (or a short status). */
  children: React.ReactNode;
  /** Badge hue. Default `red`: a count on a section asks for attention. */
  color?: PaletteColor;
  /** Badge treatment. Default `solid`. */
  variant?: Exclude<Variant, "ghost">;
  /** The Badge `<span>`. */
  ref?: React.Ref<HTMLSpanElement>;
};

/** A count on the corner of the icon: a small Badge, read after the label. */
function BottomNavItemCount({
  color = "red",
  variant = "solid",
  className,
  ...rest
}: BottomNavItemCountProps) {
  return (
    <Badge.Root
      {...rest}
      size="xs"
      color={color}
      variant={variant}
      className={cx(styles.count, className)}
    />
  );
}
BottomNavItemCount.displayName = "BottomNav.ItemCount";

/** Icon and count go into the icon box, everything else is the label. */
function splitItemChildren(children: React.ReactNode, iconOnly: boolean) {
  const icon: React.ReactNode[] = [];
  const label: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === BottomNavItemIcon || child.type === BottomNavItemCount)
    ) {
      icon.push(child);
    } else {
      label.push(child);
    }
  });
  // The label comes first in the DOM, so the name reads «Заказы 3»; CSS puts the icon on top.
  return (
    <>
      <span className={iconOnly ? visuallyHiddenClass : styles.label}>{label}</span>
      {/* Keeps the words apart in the accessible name; a flex container renders no space. */}{" "}
      <span className={cx(styles.glyph, press.pressPartCompact)}>{icon}</span>
    </>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

type BottomNavItemOwnProps = {
  /** Current section: `aria-current="page"`. Links rendered by a router may set it themselves. */
  current?: boolean;
  disabled?: boolean;
  /** Render the single child element (a router link) as the item; its children are the content. */
  asChild?: boolean;
  /** `BottomNav.ItemIcon`, an optional `BottomNav.ItemCount` and the label. */
  children?: React.ReactNode;
};

export type BottomNavItemProps = BottomNavItemOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof BottomNavItemOwnProps> & {
    /** Renders an `<a>` instead of a `<button>`. */
    href?: string;
    target?: string;
    rel?: string;
    /** The `<a>`, `<button>` or the `asChild` element. */
    ref?: React.Ref<HTMLElement>;
  };

/** A section of the bar: the icon above a short label, both in the primary color while current. */
function BottomNavItem({
  current = false,
  disabled = false,
  asChild = false,
  href,
  className,
  children,
  onClick,
  type,
  ref,
  ...rest
}: BottomNavItemProps) {
  const { iconOnly, floating } = React.useContext(LookContext);
  const shared = {
    ...rest,
    className: cx(styles.item, press.pressHost, floating && touchTargetRowClass, className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    },
    "aria-current": current ? ("page" as const) : rest["aria-current"],
    ...toDataAttributes({ disabled: disabled || undefined }),
  };

  const child =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null;

  if (child) {
    return (
      // A disabled child leaves the Tab order and loses a plain `href` (Slot), like the other kinds.
      <Slot
        {...shared}
        ref={ref}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
      >
        {React.cloneElement(child, undefined, splitItemChildren(child.props.children, iconOnly))}
      </Slot>
    );
  }
  if (href !== undefined) {
    return (
      <a
        {...(shared as React.ComponentPropsWithoutRef<"a">)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
      >
        {splitItemChildren(children, iconOnly)}
      </a>
    );
  }
  return (
    <button
      {...shared}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      disabled={disabled}
    >
      {splitItemChildren(children, iconOnly)}
    </button>
  );
}
BottomNavItem.displayName = "BottomNav.Item";

// ─── Public API ───────────────────────────────────────────────────────────────

export const BottomNav = {
  Root: BottomNavRoot,
  Item: BottomNavItem,
  ItemIcon: BottomNavItemIcon,
  ItemCount: BottomNavItemCount,
  Action: BottomNavAction,
};
