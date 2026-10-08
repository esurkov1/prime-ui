import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./PageContent.module.css";

/** Cap of the page column inside `main`. */
export type PageContentMaxWidth = "full" | "readable" | "wide";

export type PageContentRootProps = React.HTMLAttributes<HTMLDivElement> & {
  maxWidth?: PageContentMaxWidth;
  ref?: React.Ref<HTMLDivElement>;
};

function PageContentRoot({ maxWidth = "full", className, ...rest }: PageContentRootProps) {
  return (
    <div
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({ "max-width": maxWidth === "full" ? undefined : maxWidth })}
    />
  );
}
PageContentRoot.displayName = "PageContent.Root";

export type PageContentSectionProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

function PageContentSection({ className, ...rest }: PageContentSectionProps) {
  return <section className={cx(styles.section, className)} {...rest} />;
}
PageContentSection.displayName = "PageContent.Section";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type PageContentActionsProps = DivProps;

/** Page-level actions (buttons) next to the title; wrap below the heading on narrow columns. */
function PageContentActions({ className, ...rest }: PageContentActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
PageContentActions.displayName = "PageContent.Actions";

export type PageContentHeaderProps = DivProps;

/** Title and description stack on the left; `PageContent.Actions` children go to the end. */
function PageContentHeader({ className, children, ...rest }: PageContentHeaderProps) {
  const items = React.Children.toArray(children);
  const isActions = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === PageContentActions;
  const actions = items.filter(isActions);

  return (
    <div
      className={cx(styles.header, className)}
      data-has-actions={actions.length > 0 ? "true" : undefined}
      {...rest}
    >
      <div className={styles.heading}>{items.filter((child) => !isActions(child))}</div>
      {actions}
    </div>
  );
}
PageContentHeader.displayName = "PageContent.Header";

export type PageContentTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

function PageContentTitle({ className, ...rest }: PageContentTitleProps) {
  return <h1 className={cx(styles.title, className)} {...rest} />;
}
PageContentTitle.displayName = "PageContent.Title";

export type PageContentDescriptionMeasure = "readable" | "full";

export type PageContentDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** `readable` — max ~65ch; `full` — the full width of the parent (e.g. an already padded `main`). */
  measure?: PageContentDescriptionMeasure;
  ref?: React.Ref<HTMLParagraphElement>;
};

function PageContentDescription({
  className,
  measure = "readable",
  ...rest
}: PageContentDescriptionProps) {
  return (
    <p
      className={cx(styles.description, className)}
      {...rest}
      {...toDataAttributes({ measure: measure === "full" ? "full" : undefined })}
    />
  );
}
PageContentDescription.displayName = "PageContent.Description";

export type PageContentBodyProps = DivProps;

function PageContentBody({ className, ...rest }: PageContentBodyProps) {
  return <div className={cx(styles.body, className)} {...rest} />;
}
PageContentBody.displayName = "PageContent.Body";

export const PageContent = {
  Root: PageContentRoot,
  Section: PageContentSection,
  Header: PageContentHeader,
  Actions: PageContentActions,
  Title: PageContentTitle,
  Description: PageContentDescription,
  Body: PageContentBody,
};
