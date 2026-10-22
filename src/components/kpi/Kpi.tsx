import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Card } from "@/components/card/Card";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { flattenChildren, isPart } from "@/internal/parts";
import { useSwapIn } from "@/internal/RegionSwap";
import { slotChild } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";

import styles from "./Kpi.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type KpiValueSize = "s" | "m" | "l";

export type KpiTone = Extract<Tone, "neutral" | "success" | "warning" | "danger">;

type KpiState = { valueSize: KpiValueSize; loading: boolean };

const KpiContext = React.createContext<KpiState>({ valueSize: "l", loading: false });

/** A `Kpi.Root` inside `Kpi.Group` is a cell of the group's card, not a card of its own. */
const GroupContext = React.createContext(false);

/** The id the root gives its title, so the card can name itself by it. */
const TitleIdContext = React.createContext<string | undefined>(undefined);

/**
 * A data part (value, change, reference line) while the figure loads: a Skeleton in the part's
 * own element, then the data fades in under the same element (`useSwapIn`, foundation §1 rule 7).
 */
function useLoadingPart(placeholder: React.ReactNode, children: React.ReactNode) {
  const { loading } = React.useContext(KpiContext);
  const swap = useSwapIn(loading ? "loading" : "data", children);
  const shownLoading = swap.state === "loading";
  return {
    key: swap.key,
    className: swap.className,
    "data-loading": shownLoading || undefined,
    children: shownLoading ? placeholder : swap.content,
  };
}

export type KpiRootProps = DivProps & {
  size?: ControlSize;
  flat?: boolean;
  asChild?: boolean;
  valueSize?: KpiValueSize;
  loading?: boolean;
};

/**
 * The parts in their places: the head (the icon, the title over the line of description and
 * period, the actions at the end), the figure (the value over the row of its change and reference
 * line), the media at the bottom. Anything else follows.
 */
function arrange(children: React.ReactNode, loading: boolean): React.ReactNode {
  // A change read from a series with nothing to show takes no place (unless it is loading).
  const items = flattenChildren(children).filter(
    (child) =>
      !(
        isPart<KpiDeltaProps>(child, KpiDelta) &&
        child.props.reading &&
        !child.props.reading.changeText &&
        !loading
      ),
  );
  const pick = (type: React.ElementType) => items.filter((child) => isPart(child, type));
  const own: React.ElementType[] = [
    KpiIcon,
    KpiTitle,
    KpiDescription,
    KpiPeriod,
    KpiActions,
    KpiValue,
    KpiDelta,
    KpiMeta,
    KpiMedia,
  ];
  const icon = pick(KpiIcon);
  const title = pick(KpiTitle);
  const description = pick(KpiDescription);
  const period = pick(KpiPeriod);
  const actions = pick(KpiActions);
  const value = pick(KpiValue);
  const change = [...pick(KpiDelta), ...pick(KpiMeta)];
  const media = pick(KpiMedia);
  const rest = items.filter(
    (child) => !(React.isValidElement(child) && own.includes(child.type as React.ElementType)),
  );
  const sub = description.length > 0 || period.length > 0;
  const head = icon.length + title.length + actions.length > 0 || sub;
  return (
    <>
      {head ? (
        <div className={styles.head}>
          {icon}
          <div className={styles.text}>
            {title}
            {sub ? (
              <div className={cx(textRole.bodyS, styles.sub)}>
                {description}
                {description.length > 0 && period.length > 0 ? (
                  <span aria-hidden="true" className={styles.dot}>
                    ·
                  </span>
                ) : null}
                {period}
              </div>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      {value.length > 0 || change.length > 0 ? (
        <div className={styles.figure}>
          {value}
          {change.length > 0 ? <div className={styles.change}>{change}</div> : null}
        </div>
      ) : null}
      {media}
      {rest}
    </>
  );
}

/**
 * A KPI card: one figure and what it means. The card is the kit's `Card` (its tier, depth, flat,
 * a link or a button as a whole); inside, the parts stand in fixed places whatever order they are
 * written in.
 */
function KpiRoot({
  size,
  flat,
  asChild = false,
  valueSize = "l",
  loading = false,
  className,
  children,
  ...rest
}: KpiRootProps) {
  const inGroup = React.useContext(GroupContext);
  const state = React.useMemo(() => ({ valueSize, loading }), [valueSize, loading]);
  const ownTitleId = React.useId();
  const content = (inner: React.ReactNode) => (
    <KpiContext.Provider value={state}>
      <TitleIdContext.Provider value={ownTitleId}>
        <div className={styles.root} {...toDataAttributes({ valueSize })}>
          {arrange(inner, loading)}
        </div>
      </TitleIdContext.Provider>
    </KpiContext.Provider>
  );
  const busy = loading || undefined;
  // A card in a grid of many is a group named by its title, so a screen reader moving through the
  // grid hears «Выручка, группа» before the figure. A link or a button card is named already.
  const title = flattenChildren(children).find((child) => isPart(child, KpiTitle));
  const titleId = React.isValidElement<{ id?: string }>(title)
    ? (title.props.id ?? ownTitleId)
    : undefined;
  const group = titleId ? { role: "group", "aria-labelledby": titleId } : {};

  if (inGroup) {
    return (
      <div aria-busy={busy} {...group} {...rest} className={cx(styles.cell, className)}>
        {content(children)}
      </div>
    );
  }
  if (asChild) {
    const child = slotChild(children, "Kpi.Root");
    return (
      <Card.Root aria-busy={busy} {...rest} size={size} flat={flat} asChild className={className}>
        {React.cloneElement(
          child,
          undefined,
          <Card.Body>{content(child.props.children)}</Card.Body>,
        )}
      </Card.Root>
    );
  }
  return (
    <Card.Root aria-busy={busy} {...group} {...rest} size={size} flat={flat} className={className}>
      <Card.Body>{content(children)}</Card.Body>
    </Card.Root>
  );
}
KpiRoot.displayName = "Kpi.Root";

export type KpiIconProps = DivProps;

/** The 40 accent tile of one icon, leading the title. */
function KpiIcon({ className, ...rest }: KpiIconProps) {
  return (
    <div
      {...rest}
      className={cx(iconBoxStyles.tile, iconSlotClass, styles.icon, className)}
      data-tone="accent"
    />
  );
}
KpiIcon.displayName = "Kpi.Icon";

export type KpiTitleProps = DivProps;

function KpiTitle({ id, className, ...rest }: KpiTitleProps) {
  const rootId = React.useContext(TitleIdContext);
  return (
    <div id={id ?? rootId} className={cx(textRole.titleS, styles.title, className)} {...rest} />
  );
}
KpiTitle.displayName = "Kpi.Title";

export type KpiDescriptionProps = SpanProps;

function KpiDescription({ className, ...rest }: KpiDescriptionProps) {
  return <span className={cx(styles.description, className)} {...rest} />;
}
KpiDescription.displayName = "Kpi.Description";

export type KpiPeriodProps = SpanProps;

/** The time the figure stands for: an interval («1–31 окт») or a moment («на 22 окт, 09:40»). */
function KpiPeriod({ className, ...rest }: KpiPeriodProps) {
  return <span className={cx(styles.period, className)} {...rest} />;
}
KpiPeriod.displayName = "Kpi.Period";

export type KpiActionsProps = DivProps;

/** The card's buttons, a menu or a period switch: the top end, centred on the title. */
function KpiActions({ className, ...rest }: KpiActionsProps) {
  return <div className={cx(styles.actions, className)} {...rest} />;
}
KpiActions.displayName = "Kpi.Actions";

export type KpiValueProps = SpanProps & { tone?: KpiTone };

/** The text role of each step of the value. */
const VALUE_ROLE: Record<KpiValueSize, string> = {
  s: textRole.bodyM,
  m: textRole.headingM,
  l: textRole.headingL,
};

/** A `Badge.Root` straight in a value («99,95% [SLA]») stands beside the text on its line. */
function hasBadge(children: React.ReactNode): boolean {
  return flattenChildren(children).some((child) => isPart(child, Badge.Root));
}

function KpiValue({ tone, className, children, ...rest }: KpiValueProps) {
  const { valueSize } = React.useContext(KpiContext);
  const part = useLoadingPart(
    <Skeleton shape="block" className={styles.valueSkeleton} />,
    children,
  );
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(
        VALUE_ROLE[valueSize],
        styles.value,
        hasBadge(part.children) && styles.badged,
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
KpiValue.displayName = "Kpi.Value";

/**
 * The change a series reading gives (`useSparkline` returns it): its signed value, its text and
 * its tone. Any object of this shape fits; the card does not depend on the chart.
 */
export type KpiDeltaReading = {
  change: number | null;
  changeText: string;
  changeTone: KpiTone;
};

export type KpiDeltaProps = SpanProps & {
  value?: number | null;
  tone?: KpiTone;
  reading?: KpiDeltaReading;
};

/**
 * The change: the kit's Badge one step below the card, its arrow up or down by the sign of
 * `value` (turning half a turn between them), its color by `tone` — the meaning, not the sign.
 * With a `reading` the three come from it, and a reading with no change draws no part.
 */
function KpiDelta({ reading, className, children, ...props }: KpiDeltaProps) {
  const { value: ownValue, tone: ownTone = "neutral", ...rest } = props;
  const value = reading ? reading.change : ownValue;
  const tone = reading ? reading.changeTone : ownTone;
  const text = reading ? reading.changeText : children;
  const { loading } = React.useContext(KpiContext);
  const part = useLoadingPart(<Skeleton size="s" className={styles.deltaSkeleton} />, text);
  const loaded = part["data-loading"] === undefined;
  const moved = typeof value === "number" && value !== 0;
  const down = typeof value === "number" && value < 0;
  if (reading && !reading.changeText && !loading) return null;
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(styles.delta, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {loaded ? (
        <Badge.Root size="s" tone={tone}>
          {moved ? (
            <Badge.Icon className={styles.trend} data-down={down || undefined}>
              <Icon name="status.trendUp" />
            </Badge.Icon>
          ) : null}
          {part.children}
        </Badge.Root>
      ) : (
        part.children
      )}
    </span>
  );
}
KpiDelta.displayName = "Kpi.Delta";

export type KpiMetaProps = SpanProps & { tone?: KpiTone };

/** The reference line beside the change: what it compares with, what backs the figure. */
function KpiMeta({ tone, className, children, ...rest }: KpiMetaProps) {
  const part = useLoadingPart(<Skeleton size="s" className={styles.metaSkeleton} />, children);
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(textRole.bodyS, styles.meta, tone && textTone.tone, part.className, className)}
      data-tone={tone}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
KpiMeta.displayName = "Kpi.Meta";

export type KpiMediaProps = DivProps;

/** A Sparkline, a ProgressBar or a breakdown: the card's full content width, at its bottom. */
function KpiMedia({ className, ...rest }: KpiMediaProps) {
  return <div className={cx(styles.media, className)} {...rest} />;
}
KpiMedia.displayName = "Kpi.Media";

export type KpiGroupProps = DivProps & {
  size?: ControlSize;
  flat?: boolean;
};

/** Related figures in one card, side by side, a faint line between them; stacked when narrow. */
function KpiGroup({ size, flat, className, children, ...rest }: KpiGroupProps) {
  return (
    <Card.Root {...rest} size={size} flat={flat} className={className}>
      <Card.Body>
        <GroupContext.Provider value={true}>
          <div className={styles.group}>
            <div className={styles.cells}>{children}</div>
          </div>
        </GroupContext.Provider>
      </Card.Body>
    </Card.Root>
  );
}
KpiGroup.displayName = "Kpi.Group";

export const Kpi = {
  Root: KpiRoot,
  Icon: KpiIcon,
  Title: KpiTitle,
  Description: KpiDescription,
  Period: KpiPeriod,
  Actions: KpiActions,
  Value: KpiValue,
  Delta: KpiDelta,
  Meta: KpiMeta,
  Media: KpiMedia,
  Group: KpiGroup,
};
