import * as React from "react";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { LinkButton } from "@/components/link-button/LinkButton";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

import styles from "./Breadcrumb.module.css";

export type BreadcrumbLabels = {
  /** `aria-label` of the `nav` landmark. */
  nav: string;
  /** Name of the «…» that stands for skipped levels (the collapse menu, `Breadcrumb.Ellipsis`). */
  ellipsis: string;
};

export const BREADCRUMB_LABELS: BreadcrumbLabels = {
  nav: "Навигационная цепочка",
  ellipsis: "Скрытые разделы",
};

type BreadcrumbContextValue = { size: ControlSize; labels: BreadcrumbLabels };

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  size: "m",
  labels: BREADCRUMB_LABELS,
});

export type BreadcrumbRootProps = React.HTMLAttributes<HTMLElement> & {
  size?: ControlSize;
  labels?: Partial<BreadcrumbLabels>;
  ref?: React.Ref<HTMLElement>;
};

/** From this many levels the middle ones collapse into a «…» menu when the path does not fit. */
const COLLAPSIBLE_MIN_ITEMS = 3;

/**
 * Whether a level is the first one. Root tells each level its place, so the chevron is rendered
 * or not by React — a `:first-child` rule is not re-evaluated by every engine when a level is
 * inserted before a kept one (Safari inside a size container), and the chevron got lost.
 */
const FirstLevelContext = React.createContext(true);

/** The chevron in front of a level; decorative (placeholder colour), absent before the first. */
function Separator() {
  const { size } = React.useContext(BreadcrumbContext);
  const first = React.useContext(FirstLevelContext);
  if (first) return null;
  return (
    <span aria-hidden="true" className={styles.separator}>
      <Icon name="nav.chevronRight" size={size} />
    </span>
  );
}

/**
 * Whether the levels at their own width (`data-measure`: none shrinks; a level past its maximum
 * width is cut by design) end past the list.
 */
function pathOverflows(nav: HTMLElement, list: HTMLElement): boolean {
  nav.setAttribute("data-measure", "true");
  let end = 0;
  for (const item of list.querySelectorAll<HTMLElement>(`:scope > .${styles.item}`)) {
    end = Math.max(end, item.offsetLeft + item.offsetWidth);
  }
  nav.removeAttribute("data-measure");
  return end > list.clientWidth + 0.5;
}

/**
 * Folds the middle levels (`data-collapsed`) only when the whole path does not fit its width
 * uncut: measured with every level in place, before paint and on every resize. Written to the DOM;
 * nothing re-renders.
 */
function useCollapse(navRef: React.RefObject<HTMLElement | null>, collapsible: boolean) {
  const fit = React.useCallback(() => {
    const nav = navRef.current;
    const list = nav?.firstElementChild;
    if (!nav || !(list instanceof HTMLElement)) return;
    nav.removeAttribute("data-collapsed");
    if (collapsible && pathOverflows(nav, list)) nav.setAttribute("data-collapsed", "true");
  }, [navRef, collapsible]);
  // Every render: a level added, removed or renamed changes what fits.
  React.useLayoutEffect(fit);
  useResizeEffect(navRef, fit);
}

function BreadcrumbRoot({
  children,
  className,
  size: sizeProp,
  labels: labelsProp,
  ref,
  ...rest
}: BreadcrumbRootProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(navRef, ref);
  const tier = useHostTier(sizeProp);
  const labels = useLabels(BREADCRUMB_LABELS, labelsProp);
  const contextValue = React.useMemo(() => ({ size: tier.size, labels }), [tier.size, labels]);

  const levels = React.Children.toArray(children);
  // Each level learns whether it is the first; keys stay the children's own.
  const items = levels.map((child, index) => (
    <FirstLevelContext.Provider
      key={React.isValidElement(child) ? child.key : index}
      value={index === 0}
    >
      {child}
    </FirstLevelContext.Provider>
  ));
  const collapsible = items.length >= COLLAPSIBLE_MIN_ITEMS;
  useCollapse(navRef, collapsible);

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {tier.provide(
        <nav
          aria-label={labels.nav}
          {...rest}
          ref={mergedRef}
          className={cx(fieldTierClass, styles.root, className)}
          {...toDataAttributes({ size: tier.size, collapsible })}
        >
          <ol
            // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
            role="list"
            className={styles.list}
          >
            {collapsible ? (
              <>
                {items[0]}
                {/* Shown only on narrow widths (container query) in place of the middle levels,
                    which are then `display: none`: a menu of those levels keeps them reachable. */}
                <FirstLevelContext.Provider value={false}>
                  <CollapseMenu levels={levels.slice(1, -1)} />
                </FirstLevelContext.Provider>
                {items.slice(1)}
              </>
            ) : (
              items
            )}
          </ol>
        </nav>,
      )}
    </BreadcrumbContext.Provider>
  );
}
BreadcrumbRoot.displayName = "Breadcrumb.Root";

/**
 * The «…» of a collapsed path: a menu button whose items are the hidden middle levels — a link
 * level stays a link, a level without one is a disabled row.
 */
function CollapseMenu({ levels }: { levels: React.ReactNode[] }) {
  const { size, labels } = React.useContext(BreadcrumbContext);
  const entries = levels.filter(
    (level): level is React.ReactElement<BreadcrumbItemProps> =>
      React.isValidElement(level) && level.type === BreadcrumbItem,
  );
  return (
    <li className={cx(styles.item, styles.ellipsis, styles.autoCollapse)}>
      <Separator />
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="ghost" tone="neutral" density="inline" aria-label={labels.ellipsis}>
            …
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size={size} align="start">
          {entries.map((level, index) => {
            const { href, children, "aria-label": name } = level.props;
            return href ? (
              <Dropdown.Item key={level.key ?? index} asChild>
                <a href={href} aria-label={name}>
                  {children}
                </a>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item key={level.key ?? index} disabled aria-label={name}>
                {children}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      </Dropdown.Root>
    </li>
  );
}

export type BreadcrumbItemProps = Omit<React.LiHTMLAttributes<HTMLLIElement>, "aria-label"> & {
  href?: string;
  current?: boolean;
  "aria-label"?: string;
  ref?: React.Ref<HTMLLIElement>;
};

function BreadcrumbItem({
  href,
  current,
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: BreadcrumbItemProps) {
  const { size } = React.useContext(BreadcrumbContext);
  return (
    <li {...rest} className={cx(styles.item, className)}>
      <Separator />
      {href ? (
        // A previous level: the kit link in the muted trail tone (primary on hover and focus).
        <LinkButton
          href={href}
          size={size}
          tone="muted"
          aria-label={ariaLabel}
          aria-current={current ? "page" : undefined}
        >
          {children}
        </LinkButton>
      ) : (
        <span
          className={styles.text}
          aria-current={current ? "page" : undefined}
          title={typeof children === "string" ? children : undefined}
        >
          {children}
        </span>
      )}
    </li>
  );
}
BreadcrumbItem.displayName = "Breadcrumb.Item";

export type BreadcrumbEllipsisProps = Omit<React.LiHTMLAttributes<HTMLLIElement>, "children"> & {
  ref?: React.Ref<HTMLLIElement>;
};

function BreadcrumbEllipsis({ className, ...rest }: BreadcrumbEllipsisProps) {
  const { labels } = React.useContext(BreadcrumbContext);
  return (
    <li {...rest} className={cx(styles.item, styles.ellipsis, className)}>
      <Separator />
      <span aria-hidden="true">…</span>
      <VisuallyHidden>{labels.ellipsis}</VisuallyHidden>
    </li>
  );
}
BreadcrumbEllipsis.displayName = "Breadcrumb.Ellipsis";

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  Item: BreadcrumbItem,
  Ellipsis: BreadcrumbEllipsis,
};
