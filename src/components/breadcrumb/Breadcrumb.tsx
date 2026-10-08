import * as React from "react";

import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { LinkButton } from "../link-button/LinkButton";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbLabels = {
  /** `aria-label` of the `nav` landmark. */
  nav: string;
  /** Accessible text of `Breadcrumb.Ellipsis` (skipped levels). */
  ellipsis: string;
};

const DEFAULT_LABELS: BreadcrumbLabels = {
  nav: "Навигационная цепочка",
  ellipsis: "Скрытые разделы",
};

type BreadcrumbContextValue = { size: ControlSize; labels: BreadcrumbLabels };

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  size: "m",
  labels: DEFAULT_LABELS,
});

export type BreadcrumbRootProps = React.HTMLAttributes<HTMLElement> & {
  /** Text of the links, the current page and the ellipsis; the chevrons take the same tier. */
  size?: ControlSize;
  /** Built-in strings. */
  labels?: Partial<BreadcrumbLabels>;
  ref?: React.Ref<HTMLElement>;
};

/** From this many levels the middle ones collapse into «…» on narrow containers. */
const COLLAPSIBLE_MIN_ITEMS = 3;

/**
 * Whether a level is the first one. Root tells each level its place, so the chevron is rendered
 * or not by React — a `:first-child` rule is not re-evaluated by every engine when a level is
 * inserted before a kept one (Safari inside a size container), and the chevron got lost.
 */
const FirstLevelContext = React.createContext(true);

/** The chevron in front of a level; decorative, and absent before the first level. */
function Separator() {
  const { size } = React.useContext(BreadcrumbContext);
  const first = React.useContext(FirstLevelContext);
  if (first) return null;
  return (
    <span aria-hidden="true" className={styles.separator}>
      <Icon name="nav.chevronRight" size={size} tone="secondary" />
    </span>
  );
}

function BreadcrumbRoot({
  children,
  className,
  size = "m",
  labels: labelsProp,
  ...rest
}: BreadcrumbRootProps) {
  const nav = labelsProp?.nav ?? DEFAULT_LABELS.nav;
  const ellipsis = labelsProp?.ellipsis ?? DEFAULT_LABELS.ellipsis;
  const contextValue = React.useMemo(
    () => ({ size, labels: { nav, ellipsis } }),
    [size, nav, ellipsis],
  );

  // Each level learns whether it is the first; keys stay the children's own.
  const items = React.Children.toArray(children).map((child, index) => (
    <FirstLevelContext.Provider
      key={React.isValidElement(child) ? child.key : index}
      value={index === 0}
    >
      {child}
    </FirstLevelContext.Provider>
  ));
  const collapsible = items.length >= COLLAPSIBLE_MIN_ITEMS;

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <ControlSizeProvider value={size}>
        <nav
          aria-label={nav}
          {...rest}
          className={cx(styles.root, className)}
          {...toDataAttributes({ size, collapsible })}
        >
          <ol className={styles.list}>
            {collapsible ? (
              <>
                {items[0]}
                {/* Shown only on narrow widths (container query) in place of the middle levels,
                    which are then `display: none`; it names them for screen readers. */}
                <FirstLevelContext.Provider value={false}>
                  <BreadcrumbEllipsis className={styles.autoCollapse} />
                </FirstLevelContext.Provider>
                {items.slice(1)}
              </>
            ) : (
              items
            )}
          </ol>
        </nav>
      </ControlSizeProvider>
    </BreadcrumbContext.Provider>
  );
}
BreadcrumbRoot.displayName = "Breadcrumb.Root";

export type BreadcrumbItemProps = Omit<React.LiHTMLAttributes<HTMLLIElement>, "aria-label"> & {
  href?: string;
  current?: boolean;
  /** For a link without visible text (e.g. only a «home» icon). Goes to the link. */
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
        <LinkButton
          href={href}
          size={size}
          className={styles.link}
          aria-label={ariaLabel}
          aria-current={current ? "page" : undefined}
        >
          {children}
        </LinkButton>
      ) : (
        <span
          className={cx(styles.text, current && styles.current)}
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
