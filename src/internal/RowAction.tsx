import * as React from "react";

import { Button } from "@/components/button/Button";
import { Tooltip, type TooltipSide } from "@/components/tooltip/Tooltip";

import { slotChild } from "./slot";
import { type ControlSize, stepDown } from "./states";

type RowActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label" | "type"
> & {
  /** Accessible name and tooltip of the action («Копировать», «Создать задачу»). */
  label: string;
  /** The tier of the row; the action is one tier down (foundation §6). */
  size: ControlSize;
  /** Where the tooltip opens. */
  side?: TooltipSide;
  /**
   * The glyph (`<Icon name="…" />`); with `asChild`, the one element (a link) whose children are
   * the glyph: the action becomes that element with the button look.
   */
  children: React.ReactNode;
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A small action beside a row (copy a value, write to an address, create inside a section): a
 * ghost neutral icon Button one tier below the row, named by `label`, which is also its tooltip.
 * With `asChild` it is a link (`mailto:`, another page) with the same look. Hosts:
 * `DescriptionList.ItemAction`, `Sidebar.ItemAction`.
 */
export function RowAction({
  label,
  size,
  side,
  asChild = false,
  children,
  ...rest
}: RowActionProps) {
  const tier = stepDown(size);
  let action: React.ReactElement;
  if (asChild) {
    const child = slotChild(children, "RowAction");
    action = (
      <Button.Root {...rest} asChild variant="ghost" tone="neutral" size={tier} aria-label={label}>
        {React.cloneElement(child, undefined, <Button.Icon>{child.props.children}</Button.Icon>)}
      </Button.Root>
    );
  } else {
    action = (
      <Button.Root {...rest} variant="ghost" tone="neutral" size={tier} aria-label={label}>
        <Button.Icon>{children}</Button.Icon>
      </Button.Root>
    );
  }
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{action}</Tooltip.Trigger>
      <Tooltip.Content side={side}>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}
