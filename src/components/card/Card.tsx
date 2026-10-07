import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { Tone } from "@/internal/states";

import styles from "./Card.module.css";

export type CardRootProps = {
  /** Structural template: KPI tiles, lists, CTA, split, cover and chart sections. Default `panel`. */
  variant?:
    | "mini"
    | "mini-media"
    | "metric"
    | "panel"
    | "stat-trend"
    | "cta"
    | "list"
    | "split"
    | "cover";
  /** No raised shadow: a flat tile on the page (dense grids where shadows add noise). */
  flat?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  { variant = "panel", flat = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, flat: flat || undefined })}
    >
      {children}
    </div>
  );
});
CardRoot.displayName = "Card.Root";

export type CardIconBoxProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardIconBox({ className, children, ...rest }: CardIconBoxProps) {
  return (
    <div className={cx(styles.iconBox, className)} {...rest}>
      {children}
    </div>
  );
}
CardIconBox.displayName = "Card.IconBox";

export type CardHeaderRowProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardHeaderRow({ className, children, ...rest }: CardHeaderRowProps) {
  return (
    <div className={cx(styles.headerRow, className)} {...rest}>
      {children}
    </div>
  );
}
CardHeaderRow.displayName = "Card.HeaderRow";

export type CardStackProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardStack({ className, children, ...rest }: CardStackProps) {
  return (
    <div className={cx(styles.stack, className)} {...rest}>
      {children}
    </div>
  );
}
CardStack.displayName = "Card.Stack";

export type CardLabelProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function CardLabel({ className, children, ...rest }: CardLabelProps) {
  return (
    <span className={cx(styles.label, className)} {...rest}>
      {children}
    </span>
  );
}
CardLabel.displayName = "Card.Label";

export type CardValueProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function CardValue({ className, children, ...rest }: CardValueProps) {
  return (
    <span className={cx(styles.value, className)} {...rest}>
      {children}
    </span>
  );
}
CardValue.displayName = "Card.Value";

export type CardDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
  return (
    <p className={cx(styles.description, className)} {...rest}>
      {children}
    </p>
  );
}
CardDescription.displayName = "Card.Description";

export type CardMediaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardMedia({ className, children, ...rest }: CardMediaProps) {
  return (
    <div className={cx(styles.media, className)} {...rest}>
      {children}
    </div>
  );
}
CardMedia.displayName = "Card.Media";

export type CardHeadingLevel = "h2" | "h3" | "h4";

export type CardTitleProps = {
  /** Heading level that fits the page outline (the look does not change). */
  as?: CardHeadingLevel;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

function CardTitle({ as: Tag = "h3", className, children, ...rest }: CardTitleProps) {
  return (
    <Tag className={cx(styles.title, className)} {...rest}>
      {children}
    </Tag>
  );
}
CardTitle.displayName = "Card.Title";

export type CardDeltaProps = {
  /** Color of the change: `success` — good, `danger` — bad, `neutral` (default). Independent of the sign. */
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function CardDelta({ className, tone = "neutral", children, ...rest }: CardDeltaProps) {
  return (
    <span {...rest} className={cx(styles.delta, className)} data-tone={tone}>
      {children}
    </span>
  );
}
CardDelta.displayName = "Card.Delta";

export type CardActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardActions({ className, children, ...rest }: CardActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
CardActions.displayName = "Card.Actions";

export type CardCoverProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardCover({ className, children, ...rest }: CardCoverProps) {
  return (
    <div className={cx(styles.cover, className)} {...rest}>
      {children}
    </div>
  );
}
CardCover.displayName = "Card.Cover";

export type CardSplitProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardSplit({ className, children, ...rest }: CardSplitProps) {
  return (
    <div className={cx(styles.split, className)} {...rest}>
      {children}
    </div>
  );
}
CardSplit.displayName = "Card.Split";

export type CardListProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>;

const CardList = React.forwardRef<HTMLUListElement, CardListProps>(function CardList(
  { className, children, ...rest },
  forwardedRef,
) {
  return (
    <ul ref={forwardedRef} className={cx(styles.list, className)} {...rest}>
      {children}
    </ul>
  );
});
CardList.displayName = "Card.List";

export type CardListItemProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLLIElement>;

const CardListItem = React.forwardRef<HTMLLIElement, CardListItemProps>(function CardListItem(
  { className, children, ...rest },
  forwardedRef,
) {
  return (
    <li ref={forwardedRef} className={cx(styles.listItem, className)} {...rest}>
      {children}
    </li>
  );
});
CardListItem.displayName = "Card.ListItem";

export type CardSectionHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardSectionHeader({ className, children, ...rest }: CardSectionHeaderProps) {
  return (
    <div className={cx(styles.sectionHeader, className)} {...rest}>
      {children}
    </div>
  );
}
CardSectionHeader.displayName = "Card.SectionHeader";

export type CardSectionTitleProps = {
  /** Heading level that fits the page outline (the look does not change). */
  as?: CardHeadingLevel;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

function CardSectionTitle({ as: Tag = "h3", className, children, ...rest }: CardSectionTitleProps) {
  return (
    <Tag className={cx(styles.sectionTitle, className)} {...rest}>
      {children}
    </Tag>
  );
}
CardSectionTitle.displayName = "Card.SectionTitle";

export type CardSectionTrailingProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardSectionTrailing({ className, children, ...rest }: CardSectionTrailingProps) {
  return (
    <div className={cx(styles.sectionTrailing, className)} {...rest}>
      {children}
    </div>
  );
}
CardSectionTrailing.displayName = "Card.SectionTrailing";

export type CardBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardBody({ className, children, ...rest }: CardBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
CardBody.displayName = "Card.Body";

export type CardChartProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardChart({ className, children, ...rest }: CardChartProps) {
  return (
    <div className={cx(styles.chart, className)} {...rest}>
      {children}
    </div>
  );
}
CardChart.displayName = "Card.Chart";

export const Card = {
  Root: CardRoot,
  IconBox: CardIconBox,
  HeaderRow: CardHeaderRow,
  Stack: CardStack,
  Label: CardLabel,
  Value: CardValue,
  Description: CardDescription,
  Media: CardMedia,
  Title: CardTitle,
  Delta: CardDelta,
  Actions: CardActions,
  Cover: CardCover,
  Split: CardSplit,
  List: CardList,
  ListItem: CardListItem,
  SectionHeader: CardSectionHeader,
  SectionTitle: CardSectionTitle,
  SectionTrailing: CardSectionTrailing,
  Body: CardBody,
  Chart: CardChart,
};
