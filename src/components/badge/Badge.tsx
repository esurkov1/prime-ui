import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { useChipTier } from "@/internal/chipTier";
import chipTier from "@/internal/chipTier.module.css";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconSlotClass } from "@/internal/iconBox";
import { namedRole } from "@/internal/namedRole";
import palette from "@/internal/palette.module.css";
import { usePartPresence } from "@/internal/partPresence";
import { splitParts } from "@/internal/parts";
import { RollingNumber } from "@/internal/RollingNumber";
import type { ControlSize, PaletteColor, Tone, Variant } from "@/internal/states";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Badge.module.css";
import { markEdgeIcons } from "./edgeIcons";

export type BadgeLabels = {
  /** Accessible name of the remove button; include the badge text, e.g. «Убрать фильтр «Москва»». */
  remove: string;
  /** Spoken when the `onRemove` promise rejects and the badge stays. */
  removeFailed: string;
};

export const BADGE_LABELS: BadgeLabels = { remove: "Удалить", removeFailed: "Не удалось удалить" };

/** A status the badge states (`tone`) or a category hue it carries (`color`), never both. */
type BadgeHueProps =
  | { color?: PaletteColor; tone?: never }
  | { tone: Extract<Tone, "neutral" | "success" | "warning" | "danger" | "info">; color?: never };

export type BadgeRootProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick" | "color"> &
  BadgeHueProps & {
    variant?: Exclude<Variant, "ghost">;
    size?: ControlSize;
    shape?: "chip" | "square";
    onRemove?: () => void | Promise<void>;
    loading?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    labels?: Partial<BadgeLabels>;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLSpanElement>;
  };

export type BadgeIconProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export type BadgeDotProps = {
  color?: PaletteColor;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "color">;

export type BadgeActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "children"
> & {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  persistent?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

const isText = (item: React.ReactNode): item is string | number =>
  typeof item === "string" || typeof item === "number";

/**
 * Next to icons, dots or inside a body (a flex row), each run of text goes into one block `.text`
 * span so a long label ellipsizes; the run's outer spaces stay outside it, so the accessible name
 * keeps them («НЕ billing», not «НЕbilling»).
 */
function wrapText(items: React.ReactNode[]): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run = "";
  const flush = () => {
    if (run === "") return;
    const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(run) ?? ["", "", run, ""];
    if (lead) out.push(lead);
    if (core) {
      out.push(
        <span key={`text-${out.length}`} className={styles.text}>
          {core}
        </span>,
      );
    }
    if (trail) out.push(trail);
    run = "";
  };
  for (const item of items) {
    if (isText(item)) run += String(item);
    else {
      flush();
      out.push(item);
    }
  }
  flush();
  return out;
}

function BadgeRoot({
  color,
  tone,
  variant = "soft",
  size: sizeProp,
  shape = "chip",
  onRemove,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  loading = false,
  labels,
  disabled: disabledProp,
  children,
  className,
  ref,
  ...rest
}: BadgeRootProps) {
  const { size, tier } = useChipTier(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  // A status tone takes its own role colors; `neutral` is the gray hue, as is no hue at all.
  const hue: PaletteColor | undefined =
    tone === undefined ? (color ?? "gray") : tone === "neutral" ? "gray" : undefined;
  // Whatever unmounts the badge (its owner took it out after the remove segment, a list changed),
  // it closes up in place and the badges after it glide.
  const presence = usePartPresence<HTMLSpanElement>({ axis: "inline" });
  const rootRef = useMergedRefs(presence.ref, ref);
  // A toggle when any part of the pressed triad is given: the body is a button over the badge.
  const toggle =
    pressedProp !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed ?? false,
    onChange: onPressedChange,
  });
  /** A promise from `onRemove` is pending: the badge waits, the segment spins. */
  const [removing, setRemoving] = React.useState(false);
  const [failure, setFailure] = React.useState("");

  const busy = removing || loading;

  const remove = () => {
    if (busy || !onRemove) return;
    setFailure("");
    const outcome = onRemove();
    if (!isPromiseLike(outcome)) return;
    setRemoving(true);
    outcome.then(
      () => setRemoving(false),
      () => {
        setRemoving(false);
        setFailure(labels?.removeFailed ?? BADGE_LABELS.removeFailed);
      },
    );
  };

  // Badge.Action lives at the end of the badge, outside the text body; one per badge.
  const { parts: actions, rest: content } = splitParts<BadgeActionProps>(children, BadgeAction);
  const actionElement = actions[0] ?? null;
  const trailing = Boolean(onRemove || actionElement);
  const iconOnly =
    !trailing &&
    content.length > 0 &&
    content.every((child) => React.isValidElement(child) && child.type === BadgeIcon);
  // The end edge belongs to the remove segment or Badge.Action when there is one.
  const edges = markEdgeIcons(content, (type) => type === BadgeIcon || type === BadgeDot, {
    endTaken: trailing,
  });
  // A read-only badge of plain text is one element: the root itself lays the text out as a block
  // and ellipsizes it. Anything richer is a flex row, so its text runs are wrapped.
  const textOnly = !trailing && !toggle && edges.children.every(isText);
  const body = (
    <ControlSizeProvider value={tier}>
      {typeof children === "number" ? (
        // A count rolls its digits to the new value (foundation §7 rule 8).
        <RollingNumber>{children}</RollingNumber>
      ) : textOnly ? (
        edges.children
      ) : (
        wrapText(edges.children)
      )}
    </ControlSizeProvider>
  );

  return (
    <span
      {...rest}
      ref={rootRef}
      // An icon-only badge named by `aria-label` is an image of that name.
      role={iconOnly ? namedRole(rest, "img") : rest.role}
      className={cx(
        styles.root,
        chipTier.tier,
        hue !== undefined && palette.hue,
        presence.className,
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      {...toDataAttributes({
        color: hue,
        tone,
        variant,
        size,
        tier,
        shape: shape === "square" ? "square" : undefined,
        "icon-only": iconOnly || undefined,
        "text-only": (textOnly && edges.children.length > 0) || undefined,
        "icon-start": edges.start || undefined,
        "icon-end": edges.end || undefined,
        removable: onRemove ? true : undefined,
        pending: busy || undefined,
        pressable: toggle || undefined,
        pressed: (toggle && pressed) || undefined,
        action: actionElement
          ? actionElement.props.persistent
            ? "persistent"
            : "reveal"
          : undefined,
        disabled: disabled || undefined,
      })}
    >
      {toggle ? (
        <button
          type="button"
          className={styles.body}
          aria-pressed={pressed}
          disabled={disabled}
          onClick={() => setPressed(!pressed)}
        >
          {body}
        </button>
      ) : trailing ? (
        <span className={styles.body}>{body}</span>
      ) : (
        // A read-only badge is one element: its content sits in the root.
        body
      )}
      {actionElement}
      {onRemove ? (
        <button
          type="button"
          className={cx(styles.remove, touchTargetBlockClass)}
          aria-label={labels?.remove ?? BADGE_LABELS.remove}
          aria-disabled={busy || undefined}
          onClick={remove}
          disabled={disabled}
        >
          <GlyphSwap layerClassName={iconSlotClass}>
            {busy ? <Spinner aria-hidden="true" /> : <Icon name="action.close" />}
          </GlyphSwap>
        </button>
      ) : null}
      {/* Mounted once a removal waits (empty), so its refusal is spoken when it comes. */}
      {onRemove && (removing || failure) ? (
        <VisuallyHidden live="polite">{failure}</VisuallyHidden>
      ) : null}
    </span>
  );
}

BadgeRoot.displayName = "Badge.Root";

function BadgeIcon({ children, className, ...rest }: BadgeIconProps) {
  // `data-edge` comes from Badge.Root when the icon sits at an edge of the badge.
  return (
    <span className={cx(styles.icon, iconSlotClass, className)} {...rest}>
      {children}
    </span>
  );
}

BadgeIcon.displayName = "Badge.Icon";

/**
 * A status dot in the current text color, or in the solid step of a palette hue (`color`). Inside
 * a badge it takes the badge tier; standalone (a marker on an icon, before a label) it takes the
 * tier of the surrounding control.
 */
function BadgeDot({ color, className, ...rest }: BadgeDotProps) {
  const size = useOptionalControlSize() ?? "m";
  // `data-edge` comes from Badge.Root when the dot sits at an edge of the badge.
  return (
    <span
      className={cx(styles.dot, color !== undefined && palette.hue, className)}
      aria-hidden="true"
      {...toDataAttributes({ size, color })}
      {...rest}
    />
  );
}

BadgeDot.displayName = "Badge.Dot";

/**
 * An action at the end of the badge («−» to hide a value): a full-height segment revealed on hover
 * and focus. The text slides toward the start and the segment comes in, inside room the badge always
 * reserves, so the badge never changes width and its neighbours never move.
 */
function BadgeAction({
  label,
  onClick,
  persistent: _persistent,
  disabled: disabledProp,
  pressed,
  children,
  className,
  ...rest
}: BadgeActionProps) {
  const disabled = useInheritedDisabled(disabledProp);
  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.action, touchTargetBlockClass, iconSlotClass, className)}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children ?? <Icon name="action.remove" />}
    </button>
  );
}

BadgeAction.displayName = "Badge.Action";

export const Badge = { Root: BadgeRoot, Icon: BadgeIcon, Dot: BadgeDot, Action: BadgeAction };
