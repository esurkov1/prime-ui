import * as React from "react";

import { Tooltip } from "@/components/tooltip/Tooltip";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { Slot } from "@/internal/slot";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./FieldAction.module.css";

/**
 * A button segment at a field's edge (Input, Textarea): full field height, the icon centred with the
 * field padding on both sides, a hover wash over the whole segment, the touch hit area. The field
 * hosts style it through `data-field-action`.
 */
const fieldActionClass = cx(styles.action, touchTargetBlockClass);

export type FieldActionButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> & {
  /** Accessible name and tooltip («Позвонить», «Открыть профиль»). */
  label: string;
  /** Renders the one child (an `<a href>`, a router link) with the segment's look and behaviour. */
  asChild?: boolean;
  /** The glyph, or with `asChild` the element that carries it. */
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

/** The segment element itself: the shared class, `data-field-action` and the accessible name. */
function segment({
  label,
  asChild = false,
  className,
  disabled,
  type = "button",
  children,
  ref,
  ...rest
}: FieldActionButtonProps) {
  const shared = {
    ...rest,
    className: cx(fieldActionClass, className),
    "aria-label": label,
    "data-field-action": "",
  };
  return asChild ? (
    <Slot {...shared} ref={ref as React.Ref<HTMLElement>} aria-disabled={disabled || undefined}>
      {children}
    </Slot>
  ) : (
    <button {...shared} ref={ref} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

/**
 * A segment without a tooltip, for a kit control whose glyph says it all (Input's clear and
 * reveal): the name stays accessible, nothing floats over the field.
 */
export function FieldActionSegment(props: FieldActionButtonProps) {
  return segment(props);
}

/** A named icon action at the field's edge with a tooltip. */
export function FieldActionButton(props: FieldActionButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{segment(props)}</Tooltip.Trigger>
      <Tooltip.Content>{props.label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

export type CopyState = "idle" | "copied" | "error";

/** How long the copy button says «copied» / «error» before it returns to «copy». */
const COPY_FEEDBACK_MS = 1600;

export type FieldCopyLabels = {
  /** Name and tooltip of the copy button. */
  copy: string;
  /** Name, tooltip and announcement once the value is copied. */
  copied: string;
  /** Name, tooltip and announcement when the clipboard refuses. */
  copyError: string;
};

export type FieldCopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children" | "type"
> & {
  /** Reads the text to copy at the moment of the press. */
  getText: () => string;
  labels: FieldCopyLabels;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Copies a field's value: the copy glyph morphs into a check (both stay mounted and cross-fade in
 * place), the name and tooltip switch to `copied`, a polite live region repeats it.
 */
export function FieldCopyButton({ getText, labels, onClick, ...rest }: FieldCopyButtonProps) {
  const [state, setState] = React.useState<CopyState>("idle");

  React.useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  const label =
    state === "copied" ? labels.copied : state === "error" ? labels.copyError : labels.copy;

  return (
    <>
      <FieldActionButton
        {...rest}
        label={label}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          try {
            await navigator.clipboard.writeText(getText());
            setState("copied");
          } catch {
            setState("error");
          }
        }}
      >
        <span className={styles.copyGlyphs} data-copy-state={state}>
          <Icon name="action.copy" data-glyph="copy" />
          <Icon name="action.check" data-glyph="check" />
        </span>
      </FieldActionButton>
      <VisuallyHidden aria-live="polite">{state === "idle" ? "" : label}</VisuallyHidden>
    </>
  );
}
