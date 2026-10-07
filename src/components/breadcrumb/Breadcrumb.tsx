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

function Separator({ size, className }: { size: ControlSize; className?: string }) {
  return (
    <li aria-hidden="true" className={cx(styles.separator, className)}>
      <Icon name="nav.chevronRight" size={size} tone="secondary" />
    </li>
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

  const items = React.Children.toArray(children);
  const collapsible = items.length >= COLLAPSIBLE_MIN_ITEMS;
  // Chevrons between levels are drawn here, so a trail is just its items.
  const trail = items.flatMap((item, index) =>
    index === 0
      ? [item]
      : [
          <Separator
            key={`separator-${React.isValidElement(item) ? item.key : index}`}
            size={size}
          />,
          item,
        ],
  );

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
                {trail.slice(0, 2)}
                {/* Shown only on narrow widths (container query) in place of the middle levels. */}
                <li aria-hidden="true" className={cx(styles.ellipsis, styles.autoCollapse)}>
                  …
                </li>
                <Separator size={size} className={styles.autoCollapse} />
                {trail.slice(2)}
              </>
            ) : (
              trail
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
      {href ? (
        <LinkButton href={href} size={size} className={styles.link} aria-label={ariaLabel}>
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
    <li {...rest} className={cx(styles.ellipsis, className)}>
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
