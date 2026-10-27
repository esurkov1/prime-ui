import * as React from "react";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { Check } from "@/icons/glyphs/check";
import { Copy } from "@/icons/glyphs/copy";
import { cx } from "@/internal/cx";
import { GlyphSwap } from "@/internal/glyphSwap";
import { Slot } from "@/internal/slot";
import { touchTargetBlockClass } from "@/internal/touchTarget";

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
  label: string;
  asChild?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A named icon action at the field's edge. The glyph cross-fades when it changes (`GlyphSwap`:
 * reveal ⇄ hide, copy → check). With a tooltip by default; `tooltip={false}` for a kit control
 * whose glyph says it all (Input's clear and reveal): the name stays accessible, nothing floats
 * over the field.
 */
export function FieldActionButton({
  label,
  asChild = false,
  tooltip = true,
  className,
  disabled,
  type = "button",
  children,
  ref,
  ...rest
}: FieldActionButtonProps & { tooltip?: boolean }) {
  const shared = {
    ...rest,
    className: cx(fieldActionClass, className),
    "aria-label": label,
    "data-field-action": "",
  };
  const segment = asChild ? (
    <Slot {...shared} ref={ref} aria-disabled={disabled || undefined}>
      {children}
    </Slot>
  ) : (
    <button {...shared} ref={ref} type={type} disabled={disabled}>
      <GlyphSwap>{children}</GlyphSwap>
    </button>
  );
  if (!tooltip) return segment;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{segment}</Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}

type FieldSectionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A labelled section at a field's end (the filter section after a search): the same segment as
 * `FieldActionButton` — full field height, hover wash, press, inset focus ring, touch hit area — but
 * as wide as its content (an icon, a text, a count) and named by it, parted from what comes before
 * by its own faint start line.
 */
export function FieldSectionButton({
  className,
  type = "button",
  ref,
  ...rest
}: FieldSectionButtonProps) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx(fieldActionClass, styles.section, className)}
      data-field-action=""
      data-field-section=""
    />
  );
}

type CopyState = "idle" | "copied" | "error";

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

type FieldCopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children" | "type"
> & {
  /** Reads the text to copy at the moment of the press. */
  getText: () => string;
  labels: FieldCopyLabels;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * Copies a field's value: the copy glyph cross-fades into a check, the name and tooltip switch to
 * `copied`, a polite live region repeats it.
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
  const CopyGlyph = state === "copied" ? Check : Copy;

  return (
    <>
      <FieldActionButton
        {...rest}
        label={label}
        data-copy-state={state}
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
        <CopyGlyph />
      </FieldActionButton>
      <VisuallyHidden live="polite">{state === "idle" ? "" : label}</VisuallyHidden>
    </>
  );
}
