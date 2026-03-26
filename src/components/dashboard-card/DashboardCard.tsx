import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./DashboardCard.module.css";

/** Мини-KPI, метрика в две строки, метрика с медиа-слотом, крупная оболочка под графики. */
export type DashboardCardVariant = "mini" | "metric" | "metric-media" | "section";

export type DashboardCardRootProps = {
  variant: DashboardCardVariant;
  /**
   * Без лёгкой тени (плоская плитка на фоне страницы).
   * По умолчанию — тень поверхности для отделения от фона.
   */
  flat?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const DashboardCardRoot = React.forwardRef<HTMLDivElement, DashboardCardRootProps>(
  function DashboardCardRoot(
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
  },
);
DashboardCardRoot.displayName = "DashboardCardRoot";

export type DashboardCardIconBoxProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardIconBox({ className, children, ...rest }: DashboardCardIconBoxProps) {
  return (
    <div className={cx(styles.iconBox, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardIconBox.displayName = "DashboardCardIconBox";

export type DashboardCardLeadProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardLead({ className, children, ...rest }: DashboardCardLeadProps) {
  return (
    <div className={cx(styles.lead, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardLead.displayName = "DashboardCardLead";

export type DashboardCardHeaderRowProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardHeaderRow({ className, children, ...rest }: DashboardCardHeaderRowProps) {
  return (
    <div className={cx(styles.headerRow, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardHeaderRow.displayName = "DashboardCardHeaderRow";

export type DashboardCardStackProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardStack({ className, children, ...rest }: DashboardCardStackProps) {
  return (
    <div className={cx(styles.stack, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardStack.displayName = "DashboardCardStack";

export type DashboardCardLabelProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function DashboardCardLabel({ className, children, ...rest }: DashboardCardLabelProps) {
  return (
    <span className={cx(styles.label, className)} {...rest}>
      {children}
    </span>
  );
}
DashboardCardLabel.displayName = "DashboardCardLabel";

export type DashboardCardValueProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function DashboardCardValue({ className, children, ...rest }: DashboardCardValueProps) {
  return (
    <span className={cx(styles.value, className)} {...rest}>
      {children}
    </span>
  );
}
DashboardCardValue.displayName = "DashboardCardValue";

export type DashboardCardDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

function DashboardCardDescription({ className, children, ...rest }: DashboardCardDescriptionProps) {
  return (
    <p className={cx(styles.description, className)} {...rest}>
      {children}
    </p>
  );
}
DashboardCardDescription.displayName = "DashboardCardDescription";

export type DashboardCardMediaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardMedia({ className, children, ...rest }: DashboardCardMediaProps) {
  return (
    <div className={cx(styles.media, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardMedia.displayName = "DashboardCardMedia";

export type DashboardCardSectionHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardSectionHeader({
  className,
  children,
  ...rest
}: DashboardCardSectionHeaderProps) {
  return (
    <div className={cx(styles.sectionHeader, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardSectionHeader.displayName = "DashboardCardSectionHeader";

export type DashboardCardSectionTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

function DashboardCardSectionTitle({
  className,
  children,
  ...rest
}: DashboardCardSectionTitleProps) {
  return (
    <h3 className={cx(styles.sectionTitle, className)} {...rest}>
      {children}
    </h3>
  );
}
DashboardCardSectionTitle.displayName = "DashboardCardSectionTitle";

export type DashboardCardSectionTrailingProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardSectionTrailing({
  className,
  children,
  ...rest
}: DashboardCardSectionTrailingProps) {
  return (
    <div className={cx(styles.sectionTrailing, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardSectionTrailing.displayName = "DashboardCardSectionTrailing";

export type DashboardCardBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function DashboardCardBody({ className, children, ...rest }: DashboardCardBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
DashboardCardBody.displayName = "DashboardCardBody";

export const DashboardCard = {
  Root: DashboardCardRoot,
  IconBox: DashboardCardIconBox,
  Lead: DashboardCardLead,
  HeaderRow: DashboardCardHeaderRow,
  Stack: DashboardCardStack,
  Label: DashboardCardLabel,
  Value: DashboardCardValue,
  Description: DashboardCardDescription,
  Media: DashboardCardMedia,
  SectionHeader: DashboardCardSectionHeader,
  SectionTitle: DashboardCardSectionTitle,
  SectionTrailing: DashboardCardSectionTrailing,
  Body: DashboardCardBody,
};
