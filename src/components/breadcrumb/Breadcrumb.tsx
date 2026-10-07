import * as React from "react";

import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

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

export type BreadcrumbRootProps = {
  children: React.ReactNode;
  className?: string;
  /** Кегль ссылок (LinkButton), текущей страницы, многоточия; иконка-разделитель и иконка «дом» — тот же ярус. */
  size?: ControlSize;
  /** Built-in strings. */
  labels?: Partial<BreadcrumbLabels>;
} & React.HTMLAttributes<HTMLElement>;

/** Minimum number of list children (item, separator, item, separator, item) to enable collapsing. */
const COLLAPSIBLE_MIN_CHILDREN = 5;

function BreadcrumbRoot({
  children,
  className,
  size = "m",
  labels: labelsProp,
  ...rest
}: BreadcrumbRootProps) {
  const items = React.Children.toArray(children);
  const collapsible = items.length >= COLLAPSIBLE_MIN_CHILDREN;
  const nav = labelsProp?.nav ?? DEFAULT_LABELS.nav;
  const ellipsis = labelsProp?.ellipsis ?? DEFAULT_LABELS.ellipsis;
  const contextValue = React.useMemo(
    () => ({ size, labels: { nav, ellipsis } }),
    [size, nav, ellipsis],
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
                {items.slice(0, 2)}
                {/* Shown only on narrow widths (container query) in place of the middle items. */}
                <li aria-hidden="true" className={cx(styles.ellipsis, styles.autoCollapse)}>
                  …
                </li>
                <li aria-hidden="true" className={cx(styles.separator, styles.autoCollapse)}>
                  <Icon name="nav.chevronRight" size={size} tone="secondary" />
                </li>
                {items.slice(2)}
              </>
            ) : (
              children
            )}
          </ol>
        </nav>
      </ControlSizeProvider>
    </BreadcrumbContext.Provider>
  );
}
BreadcrumbRoot.displayName = "Breadcrumb.Root";

export type BreadcrumbItemProps = {
  href?: string;
  current?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Для ссылки без видимого текста (например, только иконка «дом»). */
  "aria-label"?: string;
};

function BreadcrumbItem({
  href,
  current,
  children,
  className,
  "aria-label": ariaLabel,
}: BreadcrumbItemProps) {
  const { size } = React.useContext(BreadcrumbContext);
  return (
    <li className={cx(styles.item, className)}>
      {href ? (
        <LinkButton.Root
          href={href}
          size={size}
          className={styles.breadcrumbLink}
          aria-label={ariaLabel}
        >
          {children}
        </LinkButton.Root>
      ) : (
        <span
          className={cx(styles.text, current && styles.itemCurrent)}
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

export type BreadcrumbSeparatorProps = {
  children?: React.ReactNode;
  className?: string;
};

function BreadcrumbSeparator({ children, className }: BreadcrumbSeparatorProps) {
  const { size } = React.useContext(BreadcrumbContext);
  return (
    <li aria-hidden="true" className={cx(styles.separator, className)}>
      {children ?? <Icon name="nav.chevronRight" size={size} tone="secondary" />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

export type BreadcrumbEllipsisProps = {
  className?: string;
};

function BreadcrumbEllipsis({ className }: BreadcrumbEllipsisProps) {
  const { labels } = React.useContext(BreadcrumbContext);
  return (
    <li className={cx(styles.ellipsis, className)}>
      <span aria-hidden="true">…</span>
      <span className={styles.srOnly}>{labels.ellipsis}</span>
    </li>
  );
}
BreadcrumbEllipsis.displayName = "Breadcrumb.Ellipsis";

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
};
