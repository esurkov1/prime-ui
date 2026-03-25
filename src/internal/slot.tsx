import * as React from "react";

import { mergeRefs } from "./mergeRefs";

type AnyProps = Record<string, unknown>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === "className") {
      // NavLink (and similar) pass className as a function receiving route state.
      // When slot has a plain string and child has a function, compose them.
      if (typeof childValue === "function" && typeof slotValue === "string") {
        const slotClass = slotValue;
        merged[key] = (...args: unknown[]) => {
          const resolved = (childValue as (...a: unknown[]) => unknown)(...args);
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
    } else if (
      key.startsWith("on") &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      // Child handler runs first, then slot handler
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => unknown)(...args);
        (slotValue as (...a: unknown[]) => unknown)(...args);
      };
    } else {
      // Child props override slot props
      merged[key] = childValue;
    }
  }

  return merged;
}

export type SlotProps = { children?: React.ReactNode } & AnyProps;

/**
 * Merges its own props onto the single React child element.
 * The basis of the `asChild` polymorphism pattern (same idea as Radix UI `Slot`).
 *
 * Merge rules:
 * - `className` — space-joined (slot first, child second)
 * - `style`     — shallow-merged; child keys win
 * - `on*` handlers — both fire; child handler runs first
 * - All other props — child overrides slot
 * - `ref` — merged via `mergeRefs`
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...slotProps }, ref) => {
  if (!React.isValidElement(children)) {
    return <>{children}</>;
  }

  const child = children as React.ReactElement<AnyProps>;
  const childRef = (child as unknown as { ref?: React.Ref<unknown> }).ref ?? null;
  const composedRef =
    ref != null || childRef != null
      ? mergeRefs<unknown>(ref as React.Ref<unknown> | undefined, childRef ?? undefined)
      : undefined;

  const merged = mergeProps(slotProps, child.props);

  return React.cloneElement(child, {
    ...merged,
    ...(composedRef !== undefined ? { ref: composedRef } : {}),
  } as AnyProps);
});

Slot.displayName = "Slot";
