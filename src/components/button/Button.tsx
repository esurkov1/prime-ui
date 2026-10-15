import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconSlotClass } from "@/internal/iconBox";
import { iconLayout } from "@/internal/iconLayout";
import { InteractiveElement } from "@/internal/interactiveElement";
import { MorphText } from "@/internal/MorphText";
import mediaPill from "@/internal/mediaPill.module.css";
import { readCssDurationMs } from "@/internal/motionTiming";
import press from "@/internal/press.module.css";
import { Ring } from "@/internal/ring";
import { slotChild } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";
import { touchTargetClass } from "@/internal/touchTarget";
import { isPromiseLike } from "@/internal/usePendingChanges";

import { Spinner } from "../spinner/Spinner";
import styles from "./Button.module.css";

/** `tone="inherit"` takes the host's text color: fills are a `currentColor` wash, never solid. */
type ButtonColorProps =
  | {
      variant?: Variant | "shade" | "glass";
      tone?: Extract<Tone, "accent" | "neutral" | "success" | "danger">;
    }
  | {
      variant: Exclude<Variant, "solid">;
      tone: "inherit";
    };

/** `circle` is a disk with an icon only: its name is the `aria-label` (a visible label has no room). */
type ButtonShapeProps =
  | {
      shape?: "square";
    }
  | {
      shape: "circle";
      "aria-label": string;
    };

/**
 * A `<button>` runs the long-action modes; with `asChild` the child (a link) owns its content, so
 * it takes none of them.
 */
type ButtonElementProps =
  | {
      asChild?: false;
      progress?: number | null;
      holdToConfirm?: boolean;
      onConfirm?: () => void | Promise<void>;
      labels?: Partial<ButtonLabels>;
    }
  | {
      asChild: true;
      progress?: never;
      holdToConfirm?: never;
      onConfirm?: never;
      labels?: never;
      children: React.ReactElement;
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
  ButtonShapeProps &
  ButtonElementProps & {
    size?: ControlSize;
    density?: "regular" | "tight" | "inline";
    align?: "center" | "start";
    fullWidth?: boolean;
    loading?: boolean;
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    current?: boolean;
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
      out.push(
        <MorphText key={`label-${out.length}`} className={styles.label}>
          {run}
        </MorphText>,
      );
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

/**
 * The spinner of a busy button takes the glyph of its leading (or only) `Button.Icon`: the icon
 * cross-fades into the spinner and back (`GlyphSwap`), so the width never changes. Busy or not,
 * the children pass through here, so every part keeps its key and the icon box stays mounted.
 */
function withBusyGlyph(children: React.ReactNode, busy: boolean): React.ReactNode[] {
  let placed = !busy;
  return React.Children.toArray(children).map((child) => {
    if (placed || !React.isValidElement<ButtonIconProps>(child) || child.type !== ButtonIcon) {
      return child;
    }
    placed = true;
    return React.cloneElement(child, { children: <Spinner aria-hidden="true" /> });
  });
}

function ButtonRoot({
  children,
  className,
  variant = "solid",
  tone = "accent",
  shape = "square",
  size: sizeProp,
  density = "regular",
  align = "center",
  fullWidth,
  type = "button",
  loading: loadingProp = false,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  current = false,
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
  // With `asChild` the content is the child's own children (a link holding only a Button.Icon is
  // an icon-only button too).
  const layout = iconLayout(
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children,
    ButtonIcon,
  );
  const hold = useHoldToConfirm(holdToConfirm && !disabled && !loadingProp, onConfirm);
  // A toggle when any part of the pressed triad is given; an ordinary action otherwise.
  const toggle =
    pressedProp !== undefined || defaultPressed !== undefined || onPressedChange !== undefined;
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed ?? false,
    onChange: onPressedChange,
  });
  // A held confirm whose promise is pending is a loading button.
  const loading = loadingProp || hold.phase === "confirming";
  const isDisabled = disabled || loading;
  const hintId = React.useId();
  const circle = shape === "circle";
  const inProgress = progress !== undefined;
  // A square with no share known marks the action with a spinner, like `loading`, yet stays pressable.
  const spinner = !asChild && (loading || (progress === null && !circle));
  const spinnerInIcon = spinner && (layout.leadingIcon || layout.iconOnly);
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
    density: density === "regular" ? undefined : density,
    align: align === "start" ? "start" : undefined,
    // `disabled` only: a loading button is busy, not unavailable, and keeps its colors.
    disabled: disabled || undefined,
    loading,
    pressed: (toggle && pressed) || undefined,
    current: current || undefined,
    "full-width": fullWidth,
    "icon-only": layout.iconOnly || undefined,
    "leading-icon": layout.leadingIcon || undefined,
    "trailing-icon": layout.trailingIcon || undefined,
    // Without a leading icon the spinner is centered over the hidden label: width stays put.
    "loading-overlay": (spinner && !spinnerInIcon) || undefined,
    progress: (inProgress && progress !== null && !circle) || undefined,
    hold: holdToConfirm ? hold.phase : undefined,
  });
  const classes = cx(
    fieldTierClass,
    touchTargetClass,
    circle || layout.iconOnly ? press.pressCompact : press.press,
    variant === "shade" && mediaPill.inkValue,
    styles.root,
    className,
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (toggle && !event.defaultPrevented) setPressed(!pressed);
  };
  const state = {
    "aria-pressed": toggle ? pressed : undefined,
    "aria-current": current ? ("page" as const) : rest["aria-current"],
  };

  if (asChild) {
    return (
      <ControlSizeProvider value={size}>
        <InteractiveElement
          element="slot"
          {...rest}
          {...state}
          ref={ref}
          className={classes}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          onClick={handleClick as React.MouseEventHandler<HTMLElement>}
          {...dataAttrs}
        >
          {slotChild(children, "Button.Root")}
        </InteractiveElement>
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
      {...state}
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || inProgress || rest["aria-busy"] || undefined}
      aria-describedby={describedBy}
      onClick={handleClick}
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
        {spinner && !spinnerInIcon ? (
          <Spinner className={styles.spinner} aria-hidden="true" />
        ) : null}
        {morphLabels(withBusyGlyph(children, spinnerInIcon))}
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
      <GlyphSwap layerClassName={cx(styles.glyph, iconSlotClass)}>{children}</GlyphSwap>
    </span>
  );
}

ButtonIcon.displayName = "Button.Icon";

export const Button = { Root: ButtonRoot, Icon: ButtonIcon };
