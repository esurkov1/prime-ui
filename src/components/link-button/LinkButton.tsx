import type * as React from "react";

import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { fieldTierClass } from "@/internal/fieldClasses";
import { InteractiveElement } from "@/internal/interactiveElement";
import { slotChild } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";

import styles from "./LinkButton.module.css";

type LinkButtonBaseProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  size?: ControlSize;
  tone?: Extract<Tone, "accent" | "neutral"> | "muted";
  inline?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

/** A link has a URL; with `asChild` the child (a router link, a `<button>`) owns its target. */
export type LinkButtonProps = LinkButtonBaseProps &
  (
    | { asChild?: false; href: string }
    | { asChild: true; href?: never; children: React.ReactElement }
  );

export function LinkButton({
  size: sizeProp,
  tone = "accent",
  inline = false,
  disabled: disabledProp,
  asChild = false,
  children,
  className,
  href,
  ref,
  ...rest
}: LinkButtonProps) {
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const shared = {
    ...rest,
    ref,
    disabled,
    className: cx(fieldTierClass, styles.root, className),
    ...toDataAttributes({
      size,
      tone,
      inline: inline || undefined,
      disabled: disabled || undefined,
    }),
  };

  if (asChild) {
    return (
      <ControlSizeProvider value={size}>
        <InteractiveElement element="slot" {...shared}>
          {slotChild(children, "LinkButton")}
        </InteractiveElement>
      </ControlSizeProvider>
    );
  }

  // A disabled link keeps its element, id and ARIA but loses `href` (and with it the Tab stop) and
  // the click. `href` is required here by the type; `asChild` is the branch without one.
  return (
    <InteractiveElement element="link" href={href ?? ""} {...shared}>
      <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
    </InteractiveElement>
  );
}

LinkButton.displayName = "LinkButton";
