import type * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { Tone } from "@/internal/states";

import styles from "./Card.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type CardVariant =
  | "panel"
  | "mini"
  | "mini-media"
  | "metric"
  | "stat-trend"
  | "split"
  | "cta"
  | "list"
  | "cover";

export type CardRootProps = DivProps & {
  /** Structural template: KPI tiles, lists, CTA, split, cover and titled panels. Default `panel`. */
  variant?: CardVariant;
  /** No raised shadow: a flat tile on the page (dense grids where shadows add noise). */
  flat?: boolean;
};

function CardRoot({ variant = "panel", flat = false, className, ...rest }: CardRootProps) {
  return (
    <div
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, flat: flat || undefined })}
    />
  );
}
CardRoot.displayName = "Card.Root";

export type CardHeaderProps = DivProps;

/** The top row: the title first, anything after it (a control, a quiet caption) at the end. */
function CardHeader({ className, ...rest }: CardHeaderProps) {
  return <div className={cx(styles.header, className)} {...rest} />;
}
CardHeader.displayName = "Card.Header";

export type CardHeadingLevel = "h2" | "h3" | "h4";

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level that fits the page outline (the look does not change). */
  as?: CardHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
};

function CardTitle({ as: Tag = "h3", className, ...rest }: CardTitleProps) {
  return <Tag className={cx(styles.title, className)} {...rest} />;
}
CardTitle.displayName = "Card.Title";

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

function CardDescription({ className, ...rest }: CardDescriptionProps) {
  return <p className={cx(styles.description, className)} {...rest} />;
}
CardDescription.displayName = "Card.Description";

export type CardBodyProps = DivProps;

function CardBody({ className, ...rest }: CardBodyProps) {
  return <div className={cx(styles.body, className)} {...rest} />;
}
CardBody.displayName = "Card.Body";

export type CardMediaProps = DivProps;

/** A chart, an image or a gauge: edge to edge in `panel`, the top cover in `cover`, the bottom slot in `mini-media`. */
function CardMedia({ className, ...rest }: CardMediaProps) {
  return <div className={cx(styles.media, className)} {...rest} />;
}
CardMedia.displayName = "Card.Media";

export type CardFooterProps = DivProps;

/** The bottom row of buttons. */
function CardFooter({ className, ...rest }: CardFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
CardFooter.displayName = "Card.Footer";

export type CardIconProps = DivProps;

/** The 40px accent tile of a KPI; holds one icon. */
function CardIcon({ className, ...rest }: CardIconProps) {
  return <div className={cx(styles.icon, className)} {...rest} />;
}
CardIcon.displayName = "Card.Icon";

export type CardLabelProps = SpanProps;

function CardLabel({ className, ...rest }: CardLabelProps) {
  return <span className={cx(styles.label, className)} {...rest} />;
}
CardLabel.displayName = "Card.Label";

export type CardValueProps = SpanProps;

function CardValue({ className, ...rest }: CardValueProps) {
  return <span className={cx(styles.value, className)} {...rest} />;
}
CardValue.displayName = "Card.Value";

export type CardDeltaProps = SpanProps & {
  /** Color of the change: `success` — good, `danger` — bad, `neutral` (default). Independent of the sign. */
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
};

function CardDelta({ className, tone = "neutral", ...rest }: CardDeltaProps) {
  return <span {...rest} className={cx(styles.delta, className)} data-tone={tone} />;
}
CardDelta.displayName = "Card.Delta";

export type CardListProps = React.HTMLAttributes<HTMLUListElement> & {
  ref?: React.Ref<HTMLUListElement>;
};

function CardList({ className, ...rest }: CardListProps) {
  return <ul className={cx(styles.list, className)} {...rest} />;
}
CardList.displayName = "Card.List";

export type CardListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  ref?: React.Ref<HTMLLIElement>;
};

function CardListItem({ className, ...rest }: CardListItemProps) {
  return <li className={cx(styles.listItem, className)} {...rest} />;
}
CardListItem.displayName = "Card.ListItem";

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Media: CardMedia,
  Footer: CardFooter,
  Icon: CardIcon,
  Label: CardLabel,
  Value: CardValue,
  Delta: CardDelta,
  List: CardList,
  ListItem: CardListItem,
};
