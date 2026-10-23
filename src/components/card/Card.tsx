import * as React from "react";

import { Badge, type BadgeGroupProps } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Radio } from "@/components/radio/Radio";
import { Switch } from "@/components/switch/Switch";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  HeaderLineContent,
  HeaderRowContent,
  headerRowStyles,
  useTitleFloor,
} from "@/internal/headerRow";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import { flattenChildren, isPart } from "@/internal/parts";
import { press } from "@/internal/press";
import rowLink from "@/internal/rowLink.module.css";
import { Slot, slotChild } from "@/internal/slot";
import { type ControlSize, cardMarkSize, type Tone, tierMappings } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Card.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };

/** Where the cover stands: over the zones, full width, or a column at the start. */
export type CardMediaPlacement = "top" | "start";

type CardState = {
  size: ControlSize;
  selected: boolean;
  cover: CardMediaPlacement | null;
  /** A `Card.Link` tells the root it stretches over the card (the root then opens as a whole). */
  setLinked: (linked: boolean) => void;
};

const CardContext = React.createContext<CardState>({
  size: "m",
  selected: false,
  cover: null,
  setLinked: () => {},
});

/** What a header tells its mark: `row` — a one-line card with a switch; `edge` — on the cover's edge. */
type HeaderState = { mark: keyof typeof cardMarkSize; edge: boolean };

const HeaderContext = React.createContext<HeaderState>({ mark: "header", edge: false });

/** The zone a part stands in: `Card.Actions` in the footer may share the footer's width. */
const ZoneContext = React.createContext<"header" | "footer" | null>(null);

const TOTAL_ROLE: Record<ControlSize, string> = {
  xs: textRole.titleS,
  s: textRole.titleS,
  m: textRole.titleM,
  l: textRole.titleL,
  xl: textRole.headingS,
};

/** The ratio of a photo box from its computed `aspect-ratio` («4 / 3», «auto 1 / 1», «1.5»). */
function ratioOf(value: string): number | null {
  const numbers = value.match(/[\d.]+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return null;
  const [width, height = 1] = numbers.slice(-2);
  return width && height ? width / height : null;
}

/**
 * A start cover keeps the ratio of its photo (the Carousel's `ratio`): its column is the zones'
 * height times the ratio, half the card at most.
 */
function fitStartCover(split: HTMLElement | null, main: HTMLElement | null) {
  const media = split?.firstElementChild;
  const photo = media?.firstElementChild;
  if (!split || !main || !(media instanceof HTMLElement) || !photo) return;
  const ratio = ratioOf(getComputedStyle(photo).aspectRatio);
  if (!ratio) return;
  const width = Math.min(main.offsetHeight * ratio, split.clientWidth / 2);
  media.style.setProperty("--card-cover-width", `${Math.round(width)}px`);
}

export type CardRootProps = DivProps & {
  size?: ControlSize;
  selected?: boolean;
  asChild?: boolean;
};

/**
 * A card: a surface of the depth ladder holding one entity — a cover (`Card.Media`), a header, a
 * body and a footer, a zone gap apart; the footer stands off by the card padding and keeps to the
 * bottom of a stretched card. Its metrics are the surface frame of its tier (internal
 * surfaceFrame). With no zone inside it is a pane: the content (a `List`, a `ChatList`, a `Chat`)
 * stands edge to edge and pads itself.
 */
function CardRoot({
  size: sizeProp,
  selected,
  asChild = false,
  className,
  children,
  ...rest
}: CardRootProps) {
  const tier = useHostTier(sizeProp, "surface");
  const size = tier.size;
  const depth = useNestedSurfaceDepth();
  const [linked, setLinked] = React.useState(false);
  const child = asChild ? slotChild(children, "Card.Root") : null;
  const items = flattenChildren(child ? child.props.children : children);
  const media = items.find((part) => isPart<CardMediaProps>(part, CardMedia));
  // No zone straight inside: a pane for content that pads itself (a List, a ChatList, a Chat),
  // edge to edge.
  const bare = !items.some(
    (part) =>
      isPart(part, CardMedia) ||
      isPart(part, CardHeader) ||
      isPart(part, CardBody) ||
      isPart(part, CardFooter),
  );
  const cover = React.isValidElement<CardMediaProps>(media)
    ? (media.props.placement ?? "top")
    : null;
  const state = React.useMemo(
    () => ({ size, selected: selected ?? false, cover, setLinked }),
    [size, selected, cover],
  );
  // A start cover is a column beside the zones; the zones then stand in a column of their own,
  // and the photo is as tall as they are and as wide as its ratio makes it.
  const splitRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLDivElement>(null);
  const fitCover = React.useCallback(() => fitStartCover(splitRef.current, mainRef.current), []);
  React.useLayoutEffect(() => {
    if (cover === "start") fitCover();
  });
  useResizeEffect(mainRef, fitCover, { enabled: cover === "start" });
  const arranged =
    cover === "start" ? (
      <div ref={splitRef} className={styles.split}>
        {media}
        <div ref={mainRef} className={styles.main}>
          {items.filter((part) => part !== media)}
        </div>
      </div>
    ) : (
      items
    );
  const content = tier.provide(
    <CardContext.Provider value={state}>
      <SurfaceDepthProvider value={depth}>{arranged}</SurfaceDepthProvider>
    </CardContext.Provider>,
  );
  // A choice card that is one button: the element says whether it is chosen.
  const role = (child?.props as { role?: string } | undefined)?.role;
  const choice =
    child && selected !== undefined
      ? role === "radio" || role === "checkbox"
        ? { "aria-checked": selected }
        : { "aria-pressed": selected }
      : {};
  const rootProps = {
    ...rest,
    ...choice,
    className: cx(
      surfaceFrameClass,
      styles.root,
      asChild && press.press,
      linked && rowLink.host,
      className,
    ),
    "data-depth": depth,
    ...toDataAttributes({
      size,
      frame: size,
      cover: cover ?? undefined,
      bare: bare || undefined,
      selected: selected || undefined,
      interactive: asChild || undefined,
      link: linked || undefined,
    }),
  };

  if (child) {
    return <Slot {...rootProps}>{React.cloneElement(child, undefined, content)}</Slot>;
  }
  return <div {...rootProps}>{content}</div>;
}
CardRoot.displayName = "Card.Root";

export type CardMediaProps = DivProps & { placement?: CardMediaPlacement };

/**
 * The cover: the kit's `Carousel` (one photo or several), edge to edge — over the zones (`top`) or
 * a column at the start as tall as the zones and as wide as the photo's ratio (`start`). Only what
 * belongs to the photo stands on it (its dots, arrows, `Carousel.Overlay`).
 */
function CardMedia({ placement = "top", className, ...rest }: CardMediaProps) {
  return <div {...rest} className={cx(styles.media, className)} data-placement={placement} />;
}
CardMedia.displayName = "Card.Media";

export type CardHeaderProps = DivProps;

/**
 * The top zone, the kit's header row (internal/headerRow): the mark (`Card.Icon`), the title with
 * its badges on one line and the description under them, then the controls (`Card.Actions`) or
 * the choice indicator (`Card.Indicator`) at the end — whatever order they are written in.
 */
function CardHeader({ className, children, ...rest }: CardHeaderProps) {
  const { cover } = React.useContext(CardContext);
  const items = flattenChildren(children);
  const pick = (type: React.ElementType) => items.filter((part) => isPart(part, type));
  const icon = pick(CardIcon);
  const description = pick(CardDescription);
  const end = items.filter((part) => isPart(part, CardActions) || isPart(part, CardIndicator));
  const own: React.ElementType[] = [
    CardIcon,
    CardTitle,
    CardBadges,
    CardDescription,
    CardActions,
    CardIndicator,
  ];
  // A one-line card with a switch at its end: the mark is a step smaller (iOS settings row).
  const switched = end.some(
    (part) =>
      isPart<CardActionsProps>(part, CardActions) &&
      flattenChildren(part.props.children).some((control) => isPart(control, Switch.Root)),
  );
  const oneLine = description.length === 0;
  const edge = cover === "top" && icon.length > 0;
  const header = React.useMemo(
    () => ({ mark: oneLine && switched ? ("row" as const) : ("header" as const), edge }),
    [oneLine, switched, edge],
  );
  return (
    <HeaderContext.Provider value={header}>
      <ZoneContext.Provider value="header">
        <div
          {...rest}
          className={cx(headerRowStyles.header, styles.header, className)}
          {...toDataAttributes({
            lines: oneLine ? "one" : "two",
            mark: icon.length > 0 ? header.mark : undefined,
            edge: edge || undefined,
          })}
        >
          <HeaderRowContent
            mark={icon}
            title={pick(CardTitle)}
            badges={pick(CardBadges)}
            description={description}
            end={end}
          >
            {items.filter(
              (part) =>
                !(React.isValidElement(part) && own.includes(part.type as React.ElementType)),
            )}
          </HeaderRowContent>
        </div>
      </ZoneContext.Provider>
    </HeaderContext.Provider>
  );
}
CardHeader.displayName = "Card.Header";

export type CardIconProps = DivProps;

/**
 * The mark that leads the header, as tall as the title with its description (32 · 40 · 48 · 56 · 64): the
 * accent tile of one icon, or the record's picture (an `Avatar.Root` or a `Thumbnail.Root`
 * anywhere inside) or its state ring (a `ProgressCircle`) with no tile. A one-line card with a
 * switch takes it a step smaller; under a top cover it is the owner's avatar on the cover's edge.
 */
function CardIcon({ className, children, ...rest }: CardIconProps) {
  const { size } = React.useContext(CardContext);
  const { mark, edge } = React.useContext(HeaderContext);
  const sizes = cardMarkSize[mark];
  const { media, named, provide } = useMediaSlotHost({
    avatar: sizes.avatar[size],
    thumbnail: sizes.thumbnail[size],
    ring: sizes.ring[size],
  });
  return (
    <div
      // A picture repeats the title; a ring (`ProgressCircle`) tells the record's state by its name.
      aria-hidden={media && !named ? true : undefined}
      {...rest}
      className={cx(
        !media && iconBoxStyles.tile,
        !media && iconSlotClass,
        headerRowStyles.mark,
        styles.icon,
        className,
      )}
      {...toDataAttributes({
        tone: media ? undefined : "accent",
        size: media ? undefined : sizes.tile[size],
        media: media || undefined,
        edge: edge || undefined,
      })}
    >
      {provide(children)}
    </div>
  );
}
CardIcon.displayName = "Card.Icon";

export type CardHeadingLevel = "h2" | "h3" | "h4" | "span";

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: CardHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * What the card is about: one line, cut with an ellipsis. Beside `Card.Badges` it gives way first,
 * down to its own text or 8em, before the badges fold into «+N».
 */
function CardTitle({ as: Tag = "h3", className, ref, ...rest }: CardTitleProps) {
  const { size } = React.useContext(CardContext);
  const own = React.useRef<HTMLHeadingElement>(null);
  const mergedRef = useMergedRefs(own, ref);
  useTitleFloor(own);
  return (
    <Tag
      {...rest}
      ref={mergedRef}
      className={cx(FRAME_TITLE[size], headerRowStyles.title, className)}
    />
  );
}
CardTitle.displayName = "Card.Title";

export type CardLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

/**
 * Inside `Card.Title`: the link that opens the record. It stretches over the whole card (a click
 * anywhere opens it), takes the keyboard focus, and the card's own controls stay above it. On
 * hover the card lifts and the title is underlined; there is no arrow.
 */
function CardLink({ asChild = false, className, children, ...rest }: CardLinkProps) {
  const { setLinked } = React.useContext(CardContext);
  React.useLayoutEffect(() => {
    setLinked(true);
    return () => setLinked(false);
  }, [setLinked]);
  const props = { ...rest, className: cx(styles.link, className), "data-row-link": "" };
  if (asChild) {
    return <Slot {...props}>{slotChild(children, "Card.Link")}</Slot>;
  }
  return <a {...props}>{children}</a>;
}
CardLink.displayName = "Card.Link";

export type CardBadgesProps = Omit<BadgeGroupProps, "size" | "overflow">;

/**
 * The badges after the title, on its line, 6 apart from it: one container for every badge of the
 * record (a status, a role, a counter — the meaning is the badge's `tone` or `color`). What does
 * not fit folds into «+N» once the title has given way.
 */
function CardBadges({ className, ...rest }: CardBadgesProps) {
  const { size } = React.useContext(CardContext);
  return (
    <Badge.Group
      {...rest}
      size={tierMappings.cardBadges[size]}
      overflow="count"
      className={cx(headerRowStyles.badges, className)}
    />
  );
}
CardBadges.displayName = "Card.Badges";

export type CardDescriptionProps = DivProps;

/**
 * The line under the title: plain text with new data only, one line, cut with an ellipsis. A
 * `StatusDot` first states the record's state; the text after it follows a «·».
 */
function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
  const { size } = React.useContext(CardContext);
  return (
    <div {...rest} className={cx(FRAME_DESCRIPTION[size], headerRowStyles.description, className)}>
      <HeaderLineContent>{children}</HeaderLineContent>
    </div>
  );
}
CardDescription.displayName = "Card.Description";

export type CardActionsProps = DivProps & { fullWidth?: boolean };

/**
 * The card's controls, the card's own tier: in the header — neutral buttons, a
 * value picker, «Ещё» (with a footer only «Ещё» and the picker); in the footer — up to two buttons,
 * the accent one last, at the end or sharing the width (`fullWidth`).
 */
function CardActions({ fullWidth = false, className, children, ...rest }: CardActionsProps) {
  const { size } = React.useContext(CardContext);
  const zone = React.useContext(ZoneContext);
  const tier = useHostTier(size, "surface");
  return (
    <div
      {...rest}
      className={cx(zone === "header" ? headerRowStyles.end : styles.actions, className)}
      data-full-width={(zone === "footer" && fullWidth) || undefined}
    >
      {tier.provide(children)}
    </div>
  );
}
CardActions.displayName = "Card.Actions";

export type CardIndicatorType = "radio" | "checkbox";

export type CardIndicatorProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  type: CardIndicatorType;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The mark of a choice card at the end of its header: a radio circle (one of several) or a
 * checkbox (any of several), checked while the card is `selected`. It is `aria-hidden`; the card's
 * own element carries the state.
 */
function CardIndicator({ type, className, ...rest }: CardIndicatorProps) {
  const { size, selected } = React.useContext(CardContext);
  const Mark = type === "radio" ? Radio.Indicator : Checkbox.Indicator;
  return (
    <Mark {...rest} checked={selected} size={size} className={cx(styles.indicator, className)} />
  );
}
CardIndicator.displayName = "Card.Indicator";

export type CardBodyProps = DivProps;

/**
 * The content zone: label — value rows (`DescriptionList align="end"`), a `List` of records, a
 * form, switch rows, a chart, a `ScrollContainer` of a long list, an `EmptyPage`. Its rows are
 * separated by air, never lines.
 */
function CardBody({ className, ...rest }: CardBodyProps) {
  return <div {...rest} className={cx(styles.body, className)} />;
}
CardBody.displayName = "Card.Body";

export type CardFooterProps = DivProps;

/**
 * The bottom zone, the card padding below the content, no line: one thing at the start (a
 * `Card.Total`, an assignee picker as tall as the buttons, a note) and `Card.Actions` at the end.
 * On a narrow card the buttons go under the start part and share its width.
 */
function CardFooter({ className, children, ...rest }: CardFooterProps) {
  const { size } = React.useContext(CardContext);
  // A picker at the start (an assignee) is as tall as the buttons at the end.
  const tier = useHostTier(size, "surface");
  return (
    <ZoneContext.Provider value="footer">
      <div {...rest} className={cx(styles.footer, className)}>
        {tier.provide(children)}
      </div>
    </ZoneContext.Provider>
  );
}
CardFooter.displayName = "Card.Footer";

export type CardTotalTone = Extract<Tone, "neutral" | "success" | "warning" | "danger">;

export type CardTotalProps = DivProps & {
  label?: React.ReactNode;
  tone?: CardTotalTone;
};

/** The total at the start of the footer: the amount, tabular, with its state (`label`) above it in a `tone`. */
function CardTotal({ label, tone, className, children, ...rest }: CardTotalProps) {
  const { size } = React.useContext(CardContext);
  return (
    <div {...rest} className={cx(styles.total, className)}>
      {label !== undefined ? (
        <span
          className={cx(FRAME_DESCRIPTION[size], styles.totalLabel, tone && textTone.tone)}
          data-tone={tone}
        >
          {label}
        </span>
      ) : null}
      <span className={cx(TOTAL_ROLE[size], styles.totalValue)}>{children}</span>
    </div>
  );
}
CardTotal.displayName = "Card.Total";

export const Card = {
  Root: CardRoot,
  Media: CardMedia,
  Header: CardHeader,
  Icon: CardIcon,
  Title: CardTitle,
  Link: CardLink,
  Badges: CardBadges,
  Description: CardDescription,
  Actions: CardActions,
  Indicator: CardIndicator,
  Body: CardBody,
  Footer: CardFooter,
  Total: CardTotal,
};
