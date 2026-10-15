import * as React from "react";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import hairline from "@/internal/hairline.module.css";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import press from "@/internal/press.module.css";
import { useSwapIn } from "@/internal/RegionSwap";
import { Slot, slotChild } from "@/internal/slot";
import type { Tone } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Card.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type CardVariant = "panel" | "mini" | "stat-trend" | "split" | "cta" | "list" | "cover";

export type CardRootProps = DivProps & {
  variant?: CardVariant;
  flat?: boolean;
  loading?: boolean;
  asChild?: boolean;
};

/** The template of the card around a part: it picks the part's text role and zone hairlines. */
const VariantContext = React.createContext<CardVariant | null>(null);
/** Whether a part sits in `Card.Header` (a header-row value is a step smaller). */
const HeaderContext = React.createContext(false);
/** The card's data is loading: the value, delta and meta show Skeletons in their geometry. */
const LoadingContext = React.createContext(false);

/**
 * A data part of a KPI (value, delta, meta) while the card loads: a Skeleton in the part's own
 * element, then the data fades in under the same element (`useSwapIn`, foundation §1 rule 7).
 */
function useLoadingPart(placeholder: React.ReactNode, children: React.ReactNode) {
  const loading = React.useContext(LoadingContext);
  const swap = useSwapIn(loading ? "loading" : "data");
  return {
    key: swap.key,
    className: swap.className,
    "data-loading": loading || undefined,
    children: loading ? placeholder : children,
  };
}

/** `panel` and `list` are the zoned templates: their zones are parted by faint hairlines. */
function useZoned(): boolean {
  const variant = React.useContext(VariantContext);
  return variant === "panel" || variant === "list";
}

function CardRoot({
  variant = "panel",
  flat = false,
  loading = false,
  asChild = false,
  className,
  children,
  ...rest
}: CardRootProps) {
  const depth = useNestedSurfaceDepth();
  const content = (inner: React.ReactNode) => (
    <VariantContext.Provider value={variant}>
      <HeaderContext.Provider value={false}>
        <LoadingContext.Provider value={loading}>
          <SurfaceDepthProvider value={depth}>{inner}</SurfaceDepthProvider>
        </LoadingContext.Provider>
      </HeaderContext.Provider>
    </VariantContext.Provider>
  );
  const rootProps = {
    "aria-busy": loading || undefined,
    ...rest,
    className: cx(styles.root, asChild && press.press, className),
    "data-depth": depth,
    ...toDataAttributes({
      variant,
      flat: flat || undefined,
      interactive: asChild || undefined,
    }),
  };

  if (asChild) {
    const child = slotChild(children, "Card.Root");
    return (
      <Slot {...rootProps}>
        {React.cloneElement(child, undefined, content(child.props.children))}
      </Slot>
    );
  }
  return <div {...rootProps}>{content(children)}</div>;
}
CardRoot.displayName = "Card.Root";

export type CardHeaderProps = DivProps;

/** The top row: the title first, anything after it (a control, a quiet caption) at the end. */
function CardHeader({ className, ...rest }: CardHeaderProps) {
  const zoned = useZoned();
  return (
    <HeaderContext.Provider value={true}>
      <div className={cx(styles.header, zoned && hairline.between, className)} {...rest} />
    </HeaderContext.Provider>
  );
}
CardHeader.displayName = "Card.Header";

export type CardHeadingLevel = "h2" | "h3" | "h4";

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: CardHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
};

function CardTitle({ as: Tag = "h3", className, ...rest }: CardTitleProps) {
  // The call to action leads with a step larger title.
  const role = React.useContext(VariantContext) === "cta" ? textRole.titleM : textRole.titleS;
  return <Tag className={cx(role, styles.title, className)} {...rest} />;
}
CardTitle.displayName = "Card.Title";

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

function CardDescription({ className, ...rest }: CardDescriptionProps) {
  return <p className={cx(textRole.bodyS, styles.description, className)} {...rest} />;
}
CardDescription.displayName = "Card.Description";

export type CardBodyProps = DivProps;

function CardBody({ className, ...rest }: CardBodyProps) {
  const zoned = useZoned();
  return <div className={cx(styles.body, zoned && hairline.between, className)} {...rest} />;
}
CardBody.displayName = "Card.Body";

export type CardMediaProps = DivProps;

/** A chart, an image or a gauge: edge to edge in `panel`, the top cover in `cover`, the bottom slot in `mini`. */
function CardMedia({ className, ...rest }: CardMediaProps) {
  return <div className={cx(styles.media, className)} {...rest} />;
}
CardMedia.displayName = "Card.Media";

export type CardFooterProps = DivProps;

/** The bottom row of buttons: under a hairline in the zoned templates and in `cta`. */
function CardFooter({ className, ...rest }: CardFooterProps) {
  const variant = React.useContext(VariantContext);
  const ruled = variant === "panel" || variant === "list" || variant === "cta";
  return <div className={cx(styles.footer, ruled && hairline.top, className)} {...rest} />;
}
CardFooter.displayName = "Card.Footer";

export type CardIconProps = DivProps;

/** The accent icon tile of a KPI; holds one icon. */
function CardIcon({ className, ...rest }: CardIconProps) {
  return (
    <div
      {...rest}
      className={cx(iconBoxStyles.tile, iconSlotClass, styles.icon, className)}
      data-tone="accent"
    />
  );
}
CardIcon.displayName = "Card.Icon";

export type CardLabelProps = SpanProps;

function CardLabel({ className, ...rest }: CardLabelProps) {
  return <span className={cx(textRole.bodyS, styles.label, className)} {...rest} />;
}
CardLabel.displayName = "Card.Label";

export type CardValueProps = SpanProps;

function CardValue({ className, children, ...rest }: CardValueProps) {
  const variant = React.useContext(VariantContext);
  const inHeader = React.useContext(HeaderContext);
  // `stat-trend`: the value is the tile's headline (a step smaller beside a lead in the header
  // row); the headline follows the card's width (`.headline`).
  const role =
    variant !== "stat-trend" ? textRole.titleL : inHeader ? textRole.headingM : textRole.headingL;
  const headline = variant === "stat-trend" && !inHeader;
  const part = useLoadingPart(
    <Skeleton shape="block" className={styles.valueSkeleton} />,
    children,
  );
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(role, styles.value, headline && styles.headline, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
CardValue.displayName = "Card.Value";

export type CardDeltaProps = SpanProps & {
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
};

function CardDelta({ className, tone = "neutral", children, ...rest }: CardDeltaProps) {
  const part = useLoadingPart(<Skeleton size="s" className={styles.deltaSkeleton} />, children);
  // The status ink is the shared text tone; `neutral` keeps the secondary ink of `.delta`.
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(textRole.bodyS, styles.delta, textTone.tone, part.className, className)}
      data-tone={tone}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
CardDelta.displayName = "Card.Delta";

export type CardMetaProps = SpanProps;

/**
 * The reference line of a KPI («Лидов 120 · сделок 18»): caption, muted, tabular; it sits at the
 * bottom of the tile, so tiles in a row line their meta up.
 */
function CardMeta({ className, children, ...rest }: CardMetaProps) {
  const part = useLoadingPart(<Skeleton size="xs" className={styles.metaSkeleton} />, children);
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(textRole.caption, styles.meta, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
CardMeta.displayName = "Card.Meta";

export type CardListProps = React.HTMLAttributes<HTMLUListElement> & {
  ref?: React.Ref<HTMLUListElement>;
};

function CardList({ className, ...rest }: CardListProps) {
  const zoned = useZoned();
  return (
    <ul
      // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
      role="list"
      className={cx(styles.list, zoned && hairline.between, className)}
      {...rest}
    />
  );
}
CardList.displayName = "Card.List";

export type CardListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  ref?: React.Ref<HTMLLIElement>;
};

function CardListItem({ className, ...rest }: CardListItemProps) {
  return (
    <li className={cx(textRole.bodyM, styles.listItem, hairline.between, className)} {...rest} />
  );
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
  Meta: CardMeta,
  List: CardList,
  ListItem: CardListItem,
};
