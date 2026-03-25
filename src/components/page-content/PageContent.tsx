import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./PageContent.module.css";

/** Ограничение ширины текстового блока внутри колонки `main`. */
export type PageContentMaxWidth = "full" | "readable" | "wide";

export type PageContentRootProps = {
  maxWidth?: PageContentMaxWidth;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const PageContentRoot = React.forwardRef<HTMLDivElement, PageContentRootProps>(
  function PageContentRoot({ maxWidth = "full", className, children, ...rest }, forwardedRef) {
    return (
      <div
        ref={forwardedRef}
        className={cx(styles.root, className)}
        {...rest}
        {...toDataAttributes({
          "max-width": maxWidth === "full" ? undefined : maxWidth,
        })}
      >
        {children}
      </div>
    );
  },
);
PageContentRoot.displayName = "PageContent.Root";

export type PageContentHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function PageContentHeader({ className, children, ...rest }: PageContentHeaderProps) {
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}
PageContentHeader.displayName = "PageContent.Header";

export type PageContentTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const PageContentTitle = React.forwardRef<HTMLHeadingElement, PageContentTitleProps>(
  function PageContentTitle({ className, children, ...rest }, forwardedRef) {
    return (
      <h1 ref={forwardedRef} className={cx(styles.title, className)} {...rest}>
        {children}
      </h1>
    );
  },
);
PageContentTitle.displayName = "PageContent.Title";

export type PageContentDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

const PageContentDescription = React.forwardRef<HTMLParagraphElement, PageContentDescriptionProps>(
  function PageContentDescription({ className, children, ...rest }, forwardedRef) {
    return (
      <p ref={forwardedRef} className={cx(styles.description, className)} {...rest}>
        {children}
      </p>
    );
  },
);
PageContentDescription.displayName = "PageContent.Description";

export type PageContentBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function PageContentBody({ className, children, ...rest }: PageContentBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
PageContentBody.displayName = "PageContent.Body";

export const PageContent = {
  Root: PageContentRoot,
  Header: PageContentHeader,
  Title: PageContentTitle,
  Description: PageContentDescription,
  Body: PageContentBody,
};
