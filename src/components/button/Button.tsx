import * as React from "react";
import { readCssDurationMs } from "@/hooks/usePresence";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconLayout } from "@/internal/iconLayout";
import { MorphText } from "@/internal/MorphText";
import { Ring } from "@/internal/ring";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";
import { touchTargetClass } from "@/internal/touchTarget";
import { isPromiseLike } from "@/internal/usePendingChanges";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { Spinner } from "../spinner/Spinner";
import styles from "./Button.module.css";

/**
 * `tone="inherit"` takes the host's text color (a close button on a solid Banner): fills are a
 * `currentColor` wash, so it has no `solid` treatment.
 */
type ButtonColorProps =
  | {
      /**
       * Visual treatment. Default `solid`. `shade` — the media shade with a blur and its light
       * glyph, for a button that stands over a picture, a video or a video circle; with
       * `tone="danger"` it turns the danger disk (a failed transfer).
       */
      variant?: Variant | "shade";
      /**
       * Semantic color. Default `accent`; `danger` for destructive actions; `success` for an action
       * that is done («Оплачено»).
       */
      tone?: Extract<Tone, "accent" | "neutral" | "success" | "danger">;
    }
  | {
      variant: Exclude<Variant, "solid">;
      /** Takes the host's text color; for actions placed on a colored host. */
      tone: "inherit";
    };

/**
 * `circle` is a disk with an icon only: its name is the `aria-label` (a visible label has no room).
 */
type ButtonShapeProps =
  | {
      /**
       * Outline. Default `square` (the tier's radius). `circle` — a disk with only a `Button.Icon`:
       * as wide as it is tall, full radius, the same tiers, tones and variants; its focus ring,
       * touch area and press (`press-scale-compact`) follow the circle.
       */
      shape?: "square";
    }
  | {
      shape: "circle";
      "aria-label": string;
    };

export type ButtonLabels = {
  /** Description of a hold-to-confirm button for assistive tech. */
  holdHint: string;
};

export const BUTTON_LABELS: ButtonLabels = { holdHint: "Удерживайте, чтобы подтвердить" };

/** `cancel`: released before the end — the fill rolls back; `idle` after `done` only fades. */
type HoldPhase = "idle" | "holding" | "confirming" | "done" | "cancel";

export type ButtonRootProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "size" | "aria-pressed"
> &
  ButtonColorProps &
  ButtonShapeProps & {
    /** Tier. Default: the tier of the surrounding control (a form, a panel, a field), else `m`. */
    size?: ControlSize;
    fullWidth?: boolean;
    loading?: boolean;
    /**
     * A toggle button: `true` on, `false` off (`aria-pressed`); the on state takes the selected look
     * (accent soft fill). Leave it out for an ordinary action. For a set of toggles use ButtonGroup.
     */
    pressed?: boolean;
    /**
     * Progress of a long action started by this button, `0…1`; `null` — under way, the share
     * unknown. The button stays pressable (a cancel) and is `aria-busy`. On a square a fill grows
     * inside it (`null`: a spinner takes the leading icon's place); on a circle a ring runs along
     * its inner edge in the glyph's color and always turns. The label or description carries the
     * number («Скачивание 42%»). Remove it when done: the fill or the ring fades where it is.
     */
    progress?: number | null;
    /**
     * The action needs a held press: the fill runs for 1.2 s and `onConfirm` fires at its end.
     * Releasing earlier rolls the fill back and does nothing. Space and Enter hold too.
     */
    holdToConfirm?: boolean;
    /**
     * Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`. Return
     * the request's promise: the full fill stays and the button is `loading` until it settles;
     * resolve — the fill fades; reject — the fill rolls back.
     */
    onConfirm?: () => void | Promise<void>;
    labels?: Partial<ButtonLabels>;
    /**
     * Merges Button props onto its single child element instead of rendering `<button>`.
     * `disabled` / `loading` become `aria-disabled` (a link has no native `disabled`), `type` is
     * dropped, and no spinner is added — the child owns its content.
     */
    asChild?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
  };

/**
 * A held press (pointer, Space or Enter) that confirms after `--prime-motion-hold-confirm` (a
 * gesture time: reduced motion keeps it). Releasing, leaving the
 * button or losing focus earlier cancels. A promise from `onConfirm` keeps the press `confirming`
 * until it settles: resolve ends it like a sync confirm, reject rolls the fill back.
 */
function useHoldToConfirm(enabled: boolean, onConfirm: (() => void | Promise<void>) | undefined) {
  const [phase, setPhase] = React.useState<HoldPhase>("idle");
  const timer = React.useRef<number | undefined>(undefined);
  const confirm = React.useRef(onConfirm);
  confirm.current = onConfirm;

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = () => {
    if (!enabled || phase === "holding" || phase === "confirming" || phase === "done") return;
    setPhase("holding");
    timer.current = window.setTimeout(() => {
      const outcome = confirm.current?.();
      if (!isPromiseLike(outcome)) {
        setPhase("done");
        return;
      }
      setPhase("confirming");
      outcome.then(
        () => setPhase((current) => (current === "confirming" ? "idle" : current)),
        () => setPhase((current) => (current === "confirming" ? "cancel" : current)),
      );
    }, readCssDurationMs("--prime-motion-hold-confirm"));
  };
  const stop = () => {
    window.clearTimeout(timer.current);
    // A confirm in flight outlives the release: its answer ends it.
    setPhase((current) =>
      current === "holding" ? "cancel" : current === "done" ? "idle" : current,
    );
  };
  return { phase, start, stop };
}

/** Runs of text among the children become one `MorphText`: a changed label flows into the new one. */
function morphLabels(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run: string | null = null;
  const flush = () => {
    if (run !== null && run !== "") {
      out.push(<MorphText key={`label-${out.length}`}>{run}</MorphText>);
    }
    run = null;
  };
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run = (run ?? "") + String(child);
    } else {
      flush();
      out.push(child);
    }
  }
  flush();
  return out;
}

function ButtonRoot({
  children,
  className,
  variant = "solid",
  tone = "accent",
  shape = "square",
  size: sizeProp,
  fullWidth,
  type = "button",
  loading: loadingProp = false,
  pressed,
  progress,
  holdToConfirm = false,
  onConfirm,
  labels,
  disabled: disabledProp,
  asChild = false,
  onClick,
  ref,
  ...rest
}: ButtonRootProps) {
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const layout = iconLayout(children, ButtonIcon);
  const hold = useHoldToConfirm(holdToConfirm && !disabled && !loadingProp, onConfirm);
  // A held confirm whose promise is pending is a loading button.
  const loading = loadingProp || hold.phase === "confirming";
  const isDisabled = disabled || loading;
  const hintId = React.useId();
  const circle = shape === "circle";
  const inProgress = progress !== undefined;
  // A square with no share known marks the action with a spinner, like `loading`, yet stays pressable.
  const spinner = loading || (progress === null && !circle);
  // The fill (square) or the ring (circle) stays mounted once used, so its exit can play: the
  // ring fades at the last share it drew.
  const [fillUsed, setFillUsed] = React.useState(false);
  if (((inProgress && !circle) || holdToConfirm) && !fillUsed) setFillUsed(true);
  const [ringShare, setRingShare] = React.useState<number | null | undefined>(undefined);
  if (circle && inProgress && progress !== ringShare) setRingShare(progress);
  const dataAttrs = toDataAttributes({
    variant,
    tone,
    shape: circle ? "circle" : undefined,
    size,
    // `disabled` only: a loading button is busy, not unavailable, and keeps its colors.
    disabled: disabled || undefined,
    loading,
    pressed: pressed || undefined,
    "full-width": fullWidth,
    "icon-only": layout.iconOnly || undefined,
    "leading-icon": layout.leadingIcon || undefined,
    "trailing-icon": layout.trailingIcon || undefined,
    spinner: (spinner && !asChild) || undefined,
    // Without a leading icon the spinner is centered over the hidden label: width stays put.
    "loading-overlay":
      (spinner && !asChild && !layout.leadingIcon && !layout.iconOnly) || undefined,
    progress: (inProgress && progress !== null && !circle) || undefined,
    hold: holdToConfirm ? hold.phase : undefined,
  });
  const classes = cx(fieldTierClass, touchTargetClass, styles.root, className);

  if (asChild) {
    return (
      <ControlSizeProvider value={size}>
        <Slot
          {...rest}
          ref={ref as React.Ref<HTMLElement>}
          className={classes}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          aria-pressed={pressed}
          onClick={isDisabled ? (event: React.MouseEvent) => event.preventDefault() : onClick}
          {...dataAttrs}
        >
          {children}
        </Slot>
      </ControlSizeProvider>
    );
  }

  const {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onKeyDown,
    onKeyUp,
    onBlur,
  } = rest;
  const holdHandlers = holdToConfirm
    ? {
        onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(event);
          if (event.button === 0) hold.start();
        },
        onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerUp?.(event);
          hold.stop();
        },
        onPointerLeave: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerLeave?.(event);
          hold.stop();
        },
        onPointerCancel: (event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerCancel?.(event);
          hold.stop();
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            event.preventDefault();
            hold.start();
          }
        },
        onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyUp?.(event);
          if (event.key === " " || event.key === "Enter") hold.stop();
        },
        onBlur: (event: React.FocusEvent<HTMLButtonElement>) => {
          onBlur?.(event);
          hold.stop();
        },
        onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
          rest.onContextMenu?.(event);
          if (hold.phase === "holding" || hold.phase === "done") event.preventDefault();
        },
      }
    : null;
  const describedBy = holdToConfirm
    ? cx(rest["aria-describedby"], hintId) || undefined
    : rest["aria-describedby"];

  const button = (
    <button
      {...rest}
      {...holdHandlers}
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || inProgress || rest["aria-busy"] || undefined}
      aria-pressed={pressed}
      aria-describedby={describedBy}
      onClick={onClick}
      style={
        inProgress && !circle
          ? ({
              ...rest.style,
              "--btn-progress": progress !== null ? Math.min(1, Math.max(0, progress)) : undefined,
            } as React.CSSProperties)
          : rest.style
      }
      {...dataAttrs}
    >
      {fillUsed ? (
        <span className={styles.fillTrack} aria-hidden="true">
          <span className={styles.fill} />
        </span>
      ) : null}
      {ringShare !== undefined ? (
        <Ring
          value={ringShare}
          spin
          className={styles.ring}
          data-shown={inProgress ? "true" : "false"}
        />
      ) : null}
      <ControlSizeProvider value={size}>
        {spinner ? <Spinner className={styles.spinner} aria-hidden="true" /> : null}
        {morphLabels(children)}
      </ControlSizeProvider>
    </button>
  );
  if (!holdToConfirm) return button;
  // The hint sits beside the button: inside it would become part of the button's name.
  return (
    <>
      {button}
      <VisuallyHidden id={hintId}>{{ ...BUTTON_LABELS, ...labels }.holdHint}</VisuallyHidden>
    </>
  );
}

ButtonRoot.displayName = "Button.Root";

export type ButtonIconProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** The glyph of a button; a changed glyph (another icon `name`) cross-fades into the new one. */
function ButtonIcon({ children, className, ...rest }: ButtonIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      <GlyphSwap layerClassName={styles.glyph}>{children}</GlyphSwap>
    </span>
  );
}

ButtonIcon.displayName = "Button.Icon";

export const Button = { Root: ButtonRoot, Icon: ButtonIcon };
