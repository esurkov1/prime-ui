import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";

type AnyProps = Record<string, unknown>;
type Handler = (...args: unknown[]) => unknown;

const isPrevented = (event: unknown) =>
  typeof event === "object" && event !== null && (event as Event).defaultPrevented === true;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === "ref") continue;
    if (key === "className") {
      // NavLink (and similar) pass className as a function receiving route state.
      // When slot has a plain string and child has a function, compose them.
      if (typeof childValue === "function" && typeof slotValue === "string") {
        const slotClass = slotValue;
        merged[key] = (...args: unknown[]) => {
          const resolved = (childValue as Handler)(...args);
          return [slotClass, resolved].filter(Boolean).join(" ") || undefined;
        };
      } else {
        const parts = [slotValue, childValue].filter(Boolean);
        merged[key] = parts.length > 0 ? parts.join(" ") : undefined;
      }
    } else if (key === "style") {
      merged[key] =
        slotValue != null && childValue != null
          ? { ...(slotValue as object), ...(childValue as object) }
          : (childValue ?? slotValue);
    } else if (key === "aria-describedby" && slotValue && childValue) {
      merged[key] = `${childValue} ${slotValue}`;
    } else if (
      key.startsWith("on") &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      // The child's handler runs first; `preventDefault()` in it skips the slot's handler.
      merged[key] = (...args: unknown[]) => {
        (childValue as Handler)(...args);
        if (!isPrevented(args[0])) (slotValue as Handler)(...args);
      };
    } else if (childValue !== undefined) {
      // Child props override slot props
      merged[key] = childValue;
    }
  }

  return merged;
}

/** Stops a click on a disabled `asChild` element before any handler of the child runs. */
function blockDisabledClick(event: React.MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export type SlotProps = { children?: React.ReactNode; ref?: React.Ref<HTMLElement> } & AnyProps;

/**
 * Merges its own props onto the single React child element.
 * The basis of the `asChild` polymorphism pattern (same idea as Radix UI `Slot`).
 *
 * Merge rules:
 * - `className` — space-joined (slot first, child second)
 * - `style`     — shallow-merged; child keys win
 * - `aria-describedby` — both ids, child first
 * - `on*` handlers — both fire, child first; a child `preventDefault()` skips the slot handler
 * - All other props — a defined child prop overrides the slot prop
 * - `ref` — merged with the child's ref
 * - `aria-disabled` on the slot — clicks (pointer and keyboard-activated) are stopped in the capture
 *   phase, so the child's own `onClick` never runs and a link does not navigate
 */
export function Slot({ children, ref, ...slotProps }: SlotProps) {
  const child = React.isValidElement(children) ? (children as React.ReactElement<AnyProps>) : null;
  // React 19: a ref is a regular prop; reading `element.ref` is removed and logs an error.
  const childRef = (child?.props.ref as React.Ref<HTMLElement> | undefined) ?? undefined;
  const composedRef = useMergedRefs<HTMLElement>(ref, childRef);

  if (!child) return <>{children}</>;

  const merged = mergeProps(slotProps, child.props);
  const disabled = slotProps["aria-disabled"] === true || slotProps["aria-disabled"] === "true";
  if (disabled) merged.onClickCapture = blockDisabledClick;

  return React.cloneElement(child, { ...merged, ref: composedRef } as AnyProps);
}

Slot.displayName = "Slot";
