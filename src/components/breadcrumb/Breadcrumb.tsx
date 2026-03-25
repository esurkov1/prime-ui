import * as React from "react";

import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { BreadcrumbSize } from "@/internal/states";

import { LinkButton } from "../link-button/LinkButton";

import styles from "./Breadcrumb.module.css";

export type { BreadcrumbSize };

const BreadcrumbSizeContext = React.createContext<BreadcrumbSize>("m");
BreadcrumbSizeContext.displayName = "BreadcrumbSizeContext";

function useBreadcrumbSize(): BreadcrumbSize {
  return React.useContext(BreadcrumbSizeContext);
}

export type BreadcrumbRootProps = {
  children: React.ReactNode;
  className?: string;
  /** Кегль ссылок (LinkButton), текущей страницы, многоточия; иконка-разделитель и иконка «дом» — тот же ярус. */
  size?: BreadcrumbSize;
} & React.HTMLAttributes<HTMLElement>;

function BreadcrumbRoot({ children, className, size = "m", ...rest }: BreadcrumbRootProps) {
  return (
    <BreadcrumbSizeContext.Provider value={size}>
      <ControlSizeProvider value={size}>
        <nav
          aria-label="Breadcrumb"
          className={cx(styles.root, className)}
          {...toDataAttributes({ size })}
          {...rest}
        >
          <ol>{children}</ol>
        </nav>
      </ControlSizeProvider>
    </BreadcrumbSizeContext.Provider>
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
  const size = useBreadcrumbSize();
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
          className={current ? styles.itemCurrent : undefined}
          aria-current={current ? "page" : undefined}
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
  const size = useBreadcrumbSize();
  return (
    <li aria-hidden="true" className={cx(styles.separator, className)}>
      {children ?? <Icon name="nav.chevronRight" size={size} tone="subtle" />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

export type BreadcrumbEllipsisProps = {
  className?: string;
};

function BreadcrumbEllipsis({ className }: BreadcrumbEllipsisProps) {
  return <li className={cx(styles.ellipsis, className)}>…</li>;
}
BreadcrumbEllipsis.displayName = "Breadcrumb.Ellipsis";

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
};
