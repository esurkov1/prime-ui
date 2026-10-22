import * as React from "react";
import { createPortal } from "react-dom";

import { Badge } from "@/components/badge/Badge";
import { Icon } from "@/icons";
import { useHostTier, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import { toDataAttributes } from "@/internal/data-attributes";
import hairline from "@/internal/hairline.module.css";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { press } from "@/internal/press";
import rowLink from "@/internal/rowLink.module.css";
import { Slot, slotChild } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Card.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

export type CardRootProps = DivProps & {
  size?: ControlSize;
  flat?: boolean;
  asChild?: boolean;
};

/**
 * How the card lays its parts out, read from what stands straight in the root: `zoned` — zones
 * (`Card.Header`, `Card.Body`, `Card.List`, `Card.Footer`), padded and parted by faint hairlines;
 * `cover` — the first zone is `Card.Media`, a picture on top and the zones under it with no lines;
 * `bare` — no zone: the content (a chat, a list that pads itself) stands edge to edge.
 */
type CardLayout = "zoned" | "cover" | "bare";

const LayoutContext = React.createContext<CardLayout | null>(null);
/**
 * The zone a part sits in: a footer description is the record's one-line note; a footer inside a
 * row's folded zone closes its form (no zone line).
 */
const ZoneContext = React.createContext<"footer" | "item" | null>(null);
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

/** The zoned layout parts its zones with faint hairlines. */
function useZoned(): boolean {
  return React.useContext(LayoutContext) === "zoned";
}

/** The text parts of a header row (`Card.Header`, a record row of `Card.List`). */
const HEADER_TEXT: React.ElementType[] = [CardIcon, CardTitle, CardDescription];

/** The zones of a card: their presence and order pick its layout. */
const ZONES: React.ElementType[] = [CardHeader, CardBody, CardMedia, CardList, CardFooter];

function layoutOf(children: React.ReactNode): CardLayout {
  const first = flattenChildren(children).find(
    (child) => React.isValidElement(child) && ZONES.includes(child.type as React.ElementType),
  );
  if (!React.isValidElement(first)) return "bare";
  return first.type === CardMedia ? "cover" : "zoned";
}

function CardRoot({
  size,
  flat = false,
  asChild = false,
  className,
  children,
  ...rest
}: CardRootProps) {
  const depth = useNestedSurfaceDepth();
  // The tier sets the card's padding; the controls inside take it. A card with no `size` of its
  // own and no sized host provides nothing, so its badges keep their standalone tier.
  const tier = useHostTier(size, "surface");
  const hosted = useOptionalControlSize() !== undefined;
  const sized = (inner: React.ReactElement) =>
    size !== undefined || hosted ? tier.provide(inner) : inner;
  const [stretched, setStretched] = React.useState(false);
  const [headed, setHeaded] = React.useState(false);
  const child = asChild ? slotChild(children, "Card.Root") : null;
  const link = child ? isLinkElement(child) : false;
  const mark = stretched || link;
  const place = React.useMemo(() => ({ mark, headed, setHeaded }), [mark, headed]);
  const layout = layoutOf(child ? child.props.children : children);
  const content = (inner: React.ReactNode) => (
    <LayoutContext.Provider value={layout}>
      <ZoneContext.Provider value={null}>
        <StretchedLinkContext.Provider value={setStretched}>
          <MarkContext.Provider value={place}>
            <SurfaceDepthProvider value={depth}>{sized(<>{inner}</>)}</SurfaceDepthProvider>
          </MarkContext.Provider>
        </StretchedLinkContext.Provider>
      </ZoneContext.Provider>
    </LayoutContext.Provider>
  );
  const rootProps = {
    ...rest,
    className: cx(styles.root, asChild && press.press, stretched && rowLink.host, className),
    "data-depth": depth,
    ...toDataAttributes({
      size: tier.size,
      layout,
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
 * The top row: an optional `Card.Icon` first, then the title (and its description), then
 * `Card.Actions` at the end. In a card that opens it holds the transition arrow, at its end and
 * centred on its height.
 */
function CardHeader({ className, children, ...rest }: CardHeaderProps) {
  const zoned = useZoned();
  const { mark, setHeaded } = React.useContext(MarkContext);
  React.useLayoutEffect(() => {
    setHeaded(true);
    return () => setHeaded(false);
  }, [setHeaded]);
  return (
    <div className={cx(styles.header, zoned && hairline.between, className)} {...rest}>
      {children}
      {mark ? <LinkMark /> : null}
    </div>
  );
}
CardHeader.displayName = "Card.Header";

export type CardHeadingLevel = "h2" | "h3" | "h4";

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: CardHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * A `Badge.Root` straight in a title or a value («[У нас] 300 $», «Клиент [300 $]») stands beside
 * the text on its line, a chip gap apart: the element lays its children out in a row (`.badged`).
 */
function hasBadge(children: React.ReactNode): boolean {
  return flattenChildren(children).some((child) => isPart(child, Badge.Root));
}

function CardTitle({ as: Tag = "h3", className, children, ...rest }: CardTitleProps) {
  return (
    <Tag
      className={cx(textRole.titleS, styles.title, hasBadge(children) && styles.badged, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
CardTitle.displayName = "Card.Title";

export type CardDescriptionProps = DivProps;

function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
  const inFooter = React.useContext(ZoneContext) === "footer";
  // In the footer it is the record's note: a status dot first, the text cut to one line.
  const { parts: dots, rest: text } = inFooter
    ? splitParts(children, Badge.Dot)
    : { parts: [], rest: [children] };
  // A `<div>`, so a `Badge.Group` (a `<div>`) is valid inside it; badges in it (the state and the
  // deposit of a record, an assignee picker — whoever renders them) stand in a wrapping row (CSS).
  return (
    <div className={cx(textRole.bodyS, styles.description, className)} {...rest}>
      {inFooter ? (
        <>
          {dots}
          <span className={styles.noteText}>{text}</span>
        </>
      ) : (
        children
      )}
    </div>
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

/** A chart, an image or a gauge: the cover on top when it leads the card, edge to edge under the header or the body otherwise. */
function CardMedia({ className, ...rest }: CardMediaProps) {
  return <div className={cx(styles.media, className)} {...rest} />;
}
CardMedia.displayName = "Card.Media";

export type CardFooterDivider = CardDivider | "fill";

export type CardFooterProps = DivProps & { divider?: CardFooterDivider };

/**
 * The bottom row of buttons: under a hairline in the zoned layout. With
 * `divider="fill"` it is a zone on the next layer of the ladder, out to the card's edges, no line.
 * The row of a record: the actions, the note (`Card.Description`) and `Card.Total` at the end.
 */
function CardFooter({ divider, className, ...rest }: CardFooterProps) {
  const zoned = useZoned();
  // The buttons of a row's folded zone close its form: no line of the card's zones above them.
  const inItem = React.useContext(ZoneContext) === "item";
  const fill = divider === "fill";
  const depth = useNestedSurfaceDepth();
  const ruled = divider === "full" || (divider === undefined && !inItem && zoned);
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

export type CardTotalProps = DivProps & {
  label?: React.ReactNode;
  tone?: CardTotalTone;
};

export type CardTotalTone = Extract<Tone, "neutral" | "success" | "warning" | "danger">;

/**
 * The total of a record at the end of `Card.Footer`: the amount (title-m, tabular) with an optional
 * `label` above it — its state («к оплате 21 000 ₽», «оплачено») in a `tone`.
 */
function CardTotal({ label, tone, className, children, ...rest }: CardTotalProps) {
  return (
    <div className={cx(styles.total, className)} {...rest}>
      {label !== undefined ? (
        <span
          className={cx(textRole.bodyS, styles.totalLabel, tone && textTone.tone)}
          data-tone={tone}
        >
          {label}
        </span>
      ) : null}
      <span className={cx(textRole.titleM, styles.totalValue)}>{children}</span>
    </div>
  );
}
CardTotal.displayName = "Card.Total";

export type CardActionsProps = DivProps;

/**
 * The end of a header row (`Card.Header`, a record row of `Card.List`): the row's buttons, a switch
 * or a period switch, a quiet caption — in order, 8 apart, centred on the text.
 */
function CardActions({ className, ...rest }: CardActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
CardActions.displayName = "Card.Actions";

export type CardIconProps = DivProps;

/**
 * The mark that leads a header row: the accent tile of one icon, or the picture of the record the
 * card is about (an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, internal/mediaSlot) or its
 * state ring (a `ProgressCircle`): no tile.
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

/**
 * A row of the list. With a `Card.Title` (or a `Card.Description`, a `Card.Icon`) it is a record
 * row laid out like `Card.Header` — the icon, the title over one line of description, the row's
 * `Card.Actions` at the end — and a `Card.ListItemContent` folds open under it.
 */
function CardListItem({ className, children, ...rest }: CardListItemProps) {
  // The zone under a record row: `Card.ListItemContent` renders into it from wherever it stands in
  // the row's tree (straight in the row or inside the consumer's own form component).
  const [zone, setZone] = React.useState<HTMLDivElement | null>(null);
  const items = flattenChildren(children);
  const record = items.some(
    (child) => React.isValidElement(child) && HEADER_TEXT.includes(child.type as React.ElementType),
  );
  const rowClass = cx(
    textRole.bodyM,
    styles.listItem,
    hairline.between,
    hairline.subtle,
    className,
  );
  if (!record) {
    return (
      <li className={rowClass} {...rest}>
        <ListItemZoneContext.Provider value={zone}>{children}</ListItemZoneContext.Provider>
        <div ref={setZone} />
      </li>
    );
  }
  return (
    <li className={rowClass} data-record="" {...rest}>
      <ListItemZoneContext.Provider value={zone}>
        <div className={styles.header}>{items}</div>
      </ListItemZoneContext.Provider>
      <div ref={setZone} />
    </li>
  );
}
CardListItem.displayName = "Card.ListItem";

/** The element a record row keeps under itself for its `Card.ListItemContent`. */
const ListItemZoneContext = React.createContext<HTMLDivElement | null | undefined>(undefined);

export type CardListItemContentProps = DivProps & {
  open: boolean;
};

/**
 * The zone under a record row that folds open in place (a form the row's action opens: «Вернуть с
 * удержанием»): its content, then a `Card.Footer` whose buttons stand at the end.
 */
function CardListItemContent({
  open,
  className,
  children,
  ref,
  ...rest
}: CardListItemContentProps) {
  const zone = React.useContext(ListItemZoneContext);
  if (zone === undefined) {
    throw new Error("Card.ListItemContent must be rendered inside Card.ListItem");
  }
  const content = (
    <Disclosure open={open} className={className} ref={ref} {...rest}>
      <ZoneContext.Provider value="item">
        <div className={styles.listItemContent}>{children}</div>
      </ZoneContext.Provider>
    </Disclosure>
  );
  // Under its row, a full row wide, never in the row's cell of actions.
  return zone ? createPortal(content, zone) : null;
}
CardListItemContent.displayName = "Card.ListItemContent";

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Media: CardMedia,
  Footer: CardFooter,
  Total: CardTotal,
  Actions: CardActions,
  Link: CardLink,
  Icon: CardIcon,
  List: CardList,
  ListItem: CardListItem,
  ListItemContent: CardListItemContent,
};
