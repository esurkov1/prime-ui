import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import hairline from "@/internal/hairline.module.css";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import { splitParts } from "@/internal/parts";
import press from "@/internal/press.module.css";
import { useSwapIn } from "@/internal/RegionSwap";
import rowLink from "@/internal/rowLink.module.css";
import { Slot, slotChild } from "@/internal/slot";
import type { Tone } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Card.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type CardVariant =
  | "panel"
  | "mini"
  | "stat-trend"
  | "stat-text"
  | "split"
  | "cta"
  | "list"
  | "cover";

export type CardValueSize = "m" | "l";

export type CardRootProps = DivProps & {
  variant?: CardVariant;
  valueSize?: CardValueSize;
  flat?: boolean;
  loading?: boolean;
  asChild?: boolean;
};

/** The template of the card around a part: it picks the part's text role and zone hairlines. */
const VariantContext = React.createContext<CardVariant | null>(null);
/**
 * The zone a part sits in: a header-row value is a step smaller; a footer description is the
 * record's one-line note; a value in `Card.Total` is its total.
 */
const ZoneContext = React.createContext<"header" | "footer" | "total" | null>(null);
/** The step of a `stat-text` value: body-m medium (`m`) or title-m (`l`). */
const ValueSizeContext = React.createContext<CardValueSize>("m");
/** The card's data is loading: the value, delta and meta show Skeletons in their geometry. */
const LoadingContext = React.createContext(false);
/** `Card.Link` tells the root it stretches over the card (the root then opens as a whole). */
const StretchedLinkContext = React.createContext<(stretched: boolean) => void>(() => {});
/**
 * Where the transition arrow of a card that opens stands: with a `Card.Header` it is the header's
 * (at its end, centred on its height), otherwise the card's top corner. `mark` — the card opens.
 */
type MarkPlace = { mark: boolean; headed: boolean; setHeaded: (headed: boolean) => void };
const MarkContext = React.createContext<MarkPlace>({
  mark: false,
  headed: false,
  setHeaded: () => {},
});

/** The arrow of a card that is a link: the kit draws it itself, its gesture plays on hover. */
function LinkMark() {
  return <Icon name="nav.arrowRight" aria-hidden className={styles.mark} />;
}

/** Whether the element a card wraps is a link (an `<a>`, a router `Link` with `href` / `to`). */
function isLinkElement(child: React.ReactElement<Record<string, unknown>>): boolean {
  return child.type === "a" || child.props.href !== undefined || child.props.to !== undefined;
}

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
  valueSize = "m",
  flat = false,
  loading = false,
  asChild = false,
  className,
  children,
  ...rest
}: CardRootProps) {
  const depth = useNestedSurfaceDepth();
  const [stretched, setStretched] = React.useState(false);
  const [headed, setHeaded] = React.useState(false);
  const child = asChild ? slotChild(children, "Card.Root") : null;
  const link = child ? isLinkElement(child) : false;
  const mark = stretched || link;
  const place = React.useMemo(() => ({ mark, headed, setHeaded }), [mark, headed]);
  const content = (inner: React.ReactNode) => (
    <VariantContext.Provider value={variant}>
      <ValueSizeContext.Provider value={valueSize}>
        <ZoneContext.Provider value={null}>
          <LoadingContext.Provider value={loading}>
            <StretchedLinkContext.Provider value={setStretched}>
              <MarkContext.Provider value={place}>
                <SurfaceDepthProvider value={depth}>{inner}</SurfaceDepthProvider>
              </MarkContext.Provider>
            </StretchedLinkContext.Provider>
          </LoadingContext.Provider>
        </ZoneContext.Provider>
      </ValueSizeContext.Provider>
    </VariantContext.Provider>
  );
  const rootProps = {
    "aria-busy": loading || undefined,
    ...rest,
    className: cx(styles.root, asChild && press.press, stretched && rowLink.host, className),
    "data-depth": depth,
    ...toDataAttributes({
      variant,
      flat: flat || undefined,
      interactive: asChild || undefined,
      link: stretched || undefined,
    }),
  };

  if (child) {
    return (
      <Slot {...rootProps} data-mark={link || undefined}>
        {React.cloneElement(
          child,
          undefined,
          content(
            <>
              {child.props.children}
              {link && !headed ? <LinkMark /> : null}
            </>,
          ),
        )}
      </Slot>
    );
  }
  return <div {...rootProps}>{content(children)}</div>;
}
CardRoot.displayName = "Card.Root";

export type CardLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

/**
 * The link that opens the record the card is about: it stretches over the whole card (a click
 * anywhere opens it), takes the keyboard focus, and the card's own buttons and links stay above it.
 * The card shows its transition arrow.
 */
function CardLink({ asChild = false, className, children, ...rest }: CardLinkProps) {
  const setStretched = React.useContext(StretchedLinkContext);
  const { headed } = React.useContext(MarkContext);
  React.useLayoutEffect(() => {
    setStretched(true);
    return () => setStretched(false);
  }, [setStretched]);
  const mark = headed ? null : <LinkMark />;
  const props = { ...rest, className: cx(styles.link, className), "data-row-link": "" };
  if (asChild) {
    const child = slotChild(children, "Card.Link");
    return (
      <Slot {...props}>
        {React.cloneElement(
          child,
          undefined,
          <>
            {child.props.children}
            {mark}
          </>,
        )}
      </Slot>
    );
  }
  return (
    <a {...props}>
      {children}
      {mark}
    </a>
  );
}
CardLink.displayName = "Card.Link";

export type CardHeaderProps = DivProps;

/**
 * The top row: an optional `Card.Icon` first, then the title (and its description), anything after
 * it (a control, a quiet caption) at the end. In a card that opens it holds the transition arrow,
 * at its end and centred on its height.
 */
function CardHeader({ className, children, ...rest }: CardHeaderProps) {
  const zoned = useZoned();
  const { mark, setHeaded } = React.useContext(MarkContext);
  React.useLayoutEffect(() => {
    setHeaded(true);
    return () => setHeaded(false);
  }, [setHeaded]);
  return (
    <ZoneContext.Provider value="header">
      <div className={cx(styles.header, zoned && hairline.between, className)} {...rest}>
        {children}
        {mark ? <LinkMark /> : null}
      </div>
    </ZoneContext.Provider>
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

function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
  const inFooter = React.useContext(ZoneContext) === "footer";
  // In the footer it is the record's note: a status dot first, the text cut to one line.
  const { parts: dots, rest: text } = inFooter
    ? splitParts(children, Badge.Dot)
    : { parts: [], rest: [children] };
  return (
    <p className={cx(textRole.bodyS, styles.description, className)} {...rest}>
      {inFooter ? (
        <>
          {dots}
          <span className={styles.noteText}>{text}</span>
        </>
      ) : (
        children
      )}
    </p>
  );
}
CardDescription.displayName = "Card.Description";

export type CardDivider = "full";

export type CardBodyProps = DivProps & { divider?: CardDivider };

function CardBody({ divider, className, ...rest }: CardBodyProps) {
  const zoned = useZoned();
  return (
    <div
      className={cx(
        styles.body,
        zoned && hairline.between,
        divider && hairline.top,
        divider && hairline.subtle,
        className,
      )}
      data-divider={divider}
      {...rest}
    />
  );
}
CardBody.displayName = "Card.Body";

export type CardMediaProps = DivProps;

/** A chart, an image or a gauge: edge to edge in `panel`, the top cover in `cover`, the bottom slot in `mini`. */
function CardMedia({ className, ...rest }: CardMediaProps) {
  return <div className={cx(styles.media, className)} {...rest} />;
}
CardMedia.displayName = "Card.Media";

export type CardFooterDivider = CardDivider | "fill";

export type CardFooterProps = DivProps & { divider?: CardFooterDivider };

/**
 * The bottom row of buttons: under a hairline in the zoned templates and in `cta`. With
 * `divider="fill"` it is a zone on the next layer of the ladder, out to the card's edges, no line.
 * The row of a record: the actions, the note (`Card.Description`) and `Card.Total` at the end.
 */
function CardFooter({ divider, className, ...rest }: CardFooterProps) {
  const variant = React.useContext(VariantContext);
  const fill = divider === "fill";
  const depth = useNestedSurfaceDepth();
  const ruled =
    divider === "full" ||
    (divider === undefined && (variant === "panel" || variant === "list" || variant === "cta"));
  const footer = (
    <div
      className={cx(
        styles.footer,
        ruled && hairline.top,
        divider === "full" && hairline.subtle,
        className,
      )}
      data-divider={divider}
      data-depth={fill ? depth : undefined}
      {...rest}
    />
  );
  return (
    <ZoneContext.Provider value="footer">
      {fill ? <SurfaceDepthProvider value={depth}>{footer}</SurfaceDepthProvider> : footer}
    </ZoneContext.Provider>
  );
}
CardFooter.displayName = "Card.Footer";

export type CardTotalProps = DivProps;

/**
 * The total of a record at the end of `Card.Footer`: a `Card.Value` (title-m, tabular) with an
 * optional `Card.Meta` above it — its state («к оплате 21 000 ₽», «оплачено») in a `tone`.
 */
function CardTotal({ className, ...rest }: CardTotalProps) {
  return (
    <ZoneContext.Provider value="total">
      <div className={cx(styles.total, className)} {...rest} />
    </ZoneContext.Provider>
  );
}
CardTotal.displayName = "Card.Total";

export type CardIconProps = DivProps;

/**
 * The accent icon tile of a KPI (one icon), or the picture of the record a card is about (an
 * `Avatar.Root` or a `Thumbnail.Root` anywhere inside, internal/mediaSlot): no tile, the tile's 40
 * box. In `Card.Header` it leads, before the title and its description.
 */
function CardIcon({ className, children, ...rest }: CardIconProps) {
  const { media, named, provide } = useMediaSlotHost();
  return (
    <div
      // A picture repeats the title; a ring (`ProgressCircle`) tells the record's state by its name.
      aria-hidden={media && !named ? true : undefined}
      {...rest}
      className={cx(!media && iconBoxStyles.tile, !media && iconSlotClass, styles.icon, className)}
      data-tone={media ? undefined : "accent"}
      data-media={media ? "true" : undefined}
    >
      {provide(children)}
    </div>
  );
}
CardIcon.displayName = "Card.Icon";

export type CardLabelProps = SpanProps;

function CardLabel({ className, ...rest }: CardLabelProps) {
  return <span className={cx(textRole.bodyS, styles.label, className)} {...rest} />;
}
CardLabel.displayName = "Card.Label";

export type CardValueProps = SpanProps & {
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
};

function CardValue({ tone, className, children, ...rest }: CardValueProps) {
  const variant = React.useContext(VariantContext);
  const valueSize = React.useContext(ValueSizeContext);
  const zone = React.useContext(ZoneContext);
  const inHeader = zone === "header";
  // `stat-trend`: the value is the tile's headline (a step smaller beside a lead in the header
  // row); the headline follows the card's width (`.headline`).
  // `stat-text`: the value is a line of text, a number or a phrase alike — body-m medium, or
  // title-m with `valueSize="l"`.
  // In `Card.Total` the value is the record's total (title-m).
  const role =
    zone === "total" || (variant === "stat-text" && valueSize === "l")
      ? textRole.titleM
      : variant === "stat-text"
        ? textRole.bodyM
        : variant !== "stat-trend"
          ? textRole.titleL
          : inHeader
            ? textRole.headingM
            : textRole.headingL;
  const headline = variant === "stat-trend" && !inHeader;
  const part = useLoadingPart(
    <Skeleton shape="block" className={styles.valueSkeleton} />,
    children,
  );
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(
        role,
        styles.value,
        headline && styles.headline,
        tone && textTone.tone,
        part.className,
        className,
      )}
      data-tone={tone}
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

export type CardMetaProps = SpanProps & {
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
};

/**
 * The reference line of a KPI («Лидов 120 · сделок 18»): caption, muted, tabular; it sits at the
 * bottom of the tile, so tiles in a row line their meta up. In `Card.Total` it is the total's state.
 */
function CardMeta({ tone, className, children, ...rest }: CardMetaProps) {
  const part = useLoadingPart(<Skeleton size="xs" className={styles.metaSkeleton} />, children);
  // The status ink is the shared text tone; `neutral` keeps the muted ink of `.meta`.
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(
        textRole.caption,
        styles.meta,
        tone && textTone.tone,
        part.className,
        className,
      )}
      data-tone={tone}
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
  Total: CardTotal,
  Link: CardLink,
  Icon: CardIcon,
  Label: CardLabel,
  Value: CardValue,
  Delta: CardDelta,
  Meta: CardMeta,
  List: CardList,
  ListItem: CardListItem,
};
