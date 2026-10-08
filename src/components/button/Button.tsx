import * as React from "react";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconLayout } from "@/internal/iconLayout";
import { MorphText } from "@/internal/MorphText";
import { Slot } from "@/internal/slot";
import type { ControlSize, Tone, Variant } from "@/internal/states";
import { touchTargetClass } from "@/internal/touchTarget";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import { Spinner } from "../spinner/Spinner";
import styles from "./Button.module.css";

/**
 * `tone="inherit"` takes the host's text color (a close button on a solid Banner): fills are a
 * `currentColor` wash, so it has no `solid` treatment.
 */
type ButtonColorProps =
  | {
      /** Visual treatment. Default `solid`. */
      variant?: Variant;
      /** Semantic color. Default `accent`; `danger` for destructive actions. */
      tone?: Extract<Tone, "accent" | "neutral" | "danger">;
    }
  | {
      variant: Exclude<Variant, "solid">;
      /** Takes the host's text color; for actions placed on a colored host. */
      tone: "inherit";
    };

export type ButtonLabels = {
  /** Description of a hold-to-confirm button for assistive tech. */
  holdHint: string;
};

const BUTTON_LABELS: ButtonLabels = { holdHint: "Удерживайте, чтобы подтвердить" };

/** How long a hold-to-confirm press lasts; a gesture time, not motion, so reduced motion keeps it. */
const HOLD_MS = 1200;

/** `cancel`: released before the end — the fill rolls back; `idle` after `done` only fades. */
type HoldPhase = "idle" | "holding" | "done" | "cancel";

export type ButtonRootProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> &
  ButtonColorProps & {
    /** Tier. Default: the tier of the surrounding control (a form, a panel, a field), else `m`. */
    size?: ControlSize;
    fullWidth?: boolean;
    loading?: boolean;
    /**
     * Progress of a long action started by this button, `0…1`: a fill grows inside the button and
     * `aria-busy` is set. The label carries the number («Скачивание 42%»). Remove it when done.
     */
    progress?: number;
    /**
     * The action needs a held press: the fill runs for 1.2 s and `onConfirm` fires at its end.
     * Releasing earlier rolls the fill back and does nothing. Space and Enter hold too.
     */
    holdToConfirm?: boolean;
    /** Fires when a `holdToConfirm` press completes; the action goes here, not in `onClick`. */
    onConfirm?: () => void;
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
 * A held press (pointer, Space or Enter) that confirms after `HOLD_MS`. Releasing, leaving the
 * button or losing focus earlier cancels.
 */
function useHoldToConfirm(enabled: boolean, onConfirm: (() => void) | undefined) {
  const [phase, setPhase] = React.useState<HoldPhase>("idle");
  const timer = React.useRef<number | undefined>(undefined);
  const confirm = React.useRef(onConfirm);
  confirm.current = onConfirm;

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = () => {
    if (!enabled || phase === "holding" || phase === "done") return;
    setPhase("holding");
    timer.current = window.setTimeout(() => {
      setPhase("done");
      confirm.current?.();
    }, HOLD_MS);
  };
  const stop = () => {
    window.clearTimeout(timer.current);
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
  size: sizeProp,
  fullWidth,
  type = "button",
  loading = false,
  progress,
  holdToConfirm = false,
  onConfirm,
  labels,
  disabled,
  asChild = false,
  onClick,
  ref,
  ...rest
}: ButtonRootProps) {
  const size = useControlSize(sizeProp);
  const isDisabled = disabled || loading;
  const layout = iconLayout(children, ButtonIcon);
  const hold = useHoldToConfirm(holdToConfirm && !isDisabled, onConfirm);
  const hintId = React.useId();
  const inProgress = progress !== undefined;
  // The fill stays mounted once used, so its exit (fade and roll back) can play.
  const [fillUsed, setFillUsed] = React.useState(false);
  if ((inProgress || holdToConfirm) && !fillUsed) setFillUsed(true);
  const dataAttrs = toDataAttributes({
    variant,
    tone,
    size,
    // `disabled` only: a loading button is busy, not unavailable, and keeps its colors.
    disabled: disabled || undefined,
    loading,
    "full-width": fullWidth,
    "icon-only": layout.iconOnly || undefined,
    "leading-icon": layout.leadingIcon || undefined,
    "trailing-icon": layout.trailingIcon || undefined,
    // Without a leading icon the spinner is centered over the hidden label: width stays put.
    "loading-overlay":
      (loading && !asChild && !layout.leadingIcon && !layout.iconOnly) || undefined,
    progress: inProgress || undefined,
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
      aria-busy={loading || inProgress || undefined}
      aria-describedby={describedBy}
      onClick={onClick}
      style={
        inProgress || holdToConfirm
          ? ({
              ...rest.style,
              "--btn-progress": inProgress ? Math.min(1, Math.max(0, progress)) : undefined,
              "--btn-hold-duration": holdToConfirm ? `${HOLD_MS}ms` : undefined,
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
      <ControlSizeProvider value={size}>
        {loading ? <Spinner className={styles.spinner} aria-hidden="true" /> : null}
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

function ButtonIcon({ children, className, ...rest }: ButtonIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

ButtonIcon.displayName = "Button.Icon";

export const Button = { Root: ButtonRoot, Icon: ButtonIcon };
