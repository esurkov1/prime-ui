import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Card.module.css";

/** Карточки дашборда: KPI, списки, CTA, split, cover и секции с графиками. */
export type CardVariant =
  | "mini"
  | "mini-media"
  | "metric"
  | "section"
  | "stat-trend"
  | "cta"
  | "list"
  | "split"
  | "cover";

export type CardRootProps = {
  variant: CardVariant;
  /**
   * Без лёгкой тени (плоская плитка на фоне страницы).
   * По умолчанию — тень поверхности для отделения от фона.
   */
  flat?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  { variant, flat = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, flat })}
    >
      {children}
    </div>
  );
});
CardRoot.displayName = "CardRoot";

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
CardIconBox.displayName = "CardIconBox";

export type CardLeadProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardLead({ className, children, ...rest }: CardLeadProps) {
  return (
    <div className={cx(styles.lead, className)} {...rest}>
      {children}
    </div>
  );
}
CardLead.displayName = "CardLead";

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
CardHeaderRow.displayName = "CardHeaderRow";

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
CardStack.displayName = "CardStack";

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
CardLabel.displayName = "CardLabel";

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
CardValue.displayName = "CardValue";

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
CardDescription.displayName = "CardDescription";

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
CardMedia.displayName = "CardMedia";

export type CardTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

function CardTitle({ className, children, ...rest }: CardTitleProps) {
  return (
    <h3 className={cx(styles.title, className)} {...rest}>
      {children}
    </h3>
  );
}
CardTitle.displayName = "CardTitle";

export type CardDeltaProps = {
  /** Подкраска тренда: рост / падение / нейтрально. */
  trend?: "up" | "down" | "neutral";
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function CardDelta({ className, trend, children, ...rest }: CardDeltaProps) {
  return (
    <span
      className={cx(styles.delta, className)}
      {...(trend != null ? { "data-trend": trend } : {})}
      {...rest}
    >
      {children}
    </span>
  );
}
CardDelta.displayName = "CardDelta";

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
CardActions.displayName = "CardActions";

export type CardCtaBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardCtaBody({ className, children, ...rest }: CardCtaBodyProps) {
  return (
    <div className={cx(styles.ctaBody, className)} {...rest}>
      {children}
    </div>
  );
}
CardCtaBody.displayName = "CardCtaBody";

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
CardCover.displayName = "CardCover";

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
CardSplit.displayName = "CardSplit";

export type CardSplitCellProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardSplitCell({ className, children, ...rest }: CardSplitCellProps) {
  return (
    <div className={cx(styles.splitCell, className)} {...rest}>
      {children}
    </div>
  );
}
CardSplitCell.displayName = "CardSplitCell";

export type CardListHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function CardListHeader({ className, children, ...rest }: CardListHeaderProps) {
  return (
    <div className={cx(styles.listHeader, className)} {...rest}>
      {children}
    </div>
  );
}
CardListHeader.displayName = "CardListHeader";

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
CardList.displayName = "CardList";

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
CardListItem.displayName = "CardListItem";

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
CardSectionHeader.displayName = "CardSectionHeader";

export type CardSectionTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

function CardSectionTitle({ className, children, ...rest }: CardSectionTitleProps) {
  return (
    <h3 className={cx(styles.sectionTitle, className)} {...rest}>
      {children}
    </h3>
  );
}
CardSectionTitle.displayName = "CardSectionTitle";

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
CardSectionTrailing.displayName = "CardSectionTrailing";

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
CardBody.displayName = "CardBody";

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
CardChart.displayName = "CardChart";

export const Card = {
  Root: CardRoot,
  IconBox: CardIconBox,
  Lead: CardLead,
  HeaderRow: CardHeaderRow,
  Stack: CardStack,
  Label: CardLabel,
  Value: CardValue,
  Description: CardDescription,
  Media: CardMedia,
  Title: CardTitle,
  Delta: CardDelta,
  Actions: CardActions,
  CtaBody: CardCtaBody,
  Cover: CardCover,
  Split: CardSplit,
  SplitCell: CardSplitCell,
  ListHeader: CardListHeader,
  List: CardList,
  ListItem: CardListItem,
  SectionHeader: CardSectionHeader,
  SectionTitle: CardSectionTitle,
  SectionTrailing: CardSectionTrailing,
  Body: CardBody,
  Chart: CardChart,
};
