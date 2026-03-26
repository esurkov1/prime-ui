import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Card.module.css";

/** Карточка для дашбордов и аналитики: мини-KPI, мини-KPI с медиа, метрика, секция с графиком. */
export type CardVariant = "mini" | "mini-media" | "metric" | "section";

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
  SectionHeader: CardSectionHeader,
  SectionTitle: CardSectionTitle,
  SectionTrailing: CardSectionTrailing,
  Body: CardBody,
  Chart: CardChart,
};
