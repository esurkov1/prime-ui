import type * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useInheritedDisabledControl } from "./disabledContext";
import { Slot } from "./slot";

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, "onClick"> & {
  /** One callback ref fits whichever element renders. */
  ref?: React.Ref<HTMLElement>;
  /** Out of action: no click runs, no navigation, no Tab stop (`aria-disabled` or native). */
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

/** The link attributes exist only on the `link` element. */
type LinkAttributes = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "rel" | "download" | "hrefLang" | "referrerPolicy" | "ping"
>;

type ButtonAttributes = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "form" | "name" | "value" | "formAction"
>;

/**
 * One interactive element of a part, by kind:
 * - `link` — an `<a href>`;
 * - `button` — a `<button>` (`type` defaults to `button`);
 * - `static` — a `<div>` with no action of its own (a brand without a link): it takes no `onClick`,
 *   since a click handler needs a button or a link to reach it from the keyboard;
 * - `slot` — the consumer's one element (`asChild`: a router link), through `Slot`.
 */
type InteractiveElementProps =
  | (BaseProps & LinkAttributes & { element: "link"; href: string })
  | (BaseProps & ButtonAttributes & { element: "button"; type?: "button" | "submit" | "reset" })
  | (Omit<BaseProps, "onClick"> & { element: "static"; onClick?: never })
  | (BaseProps & { element: "slot"; children: React.ReactElement });

/**
 * The interactive element behind items, rows and links (`Sidebar.Item`, `List.Item`,
 * `BottomNav.Item`, LinkButton, Button `asChild`), with the disabled guard on every branch: a
 * disabled element runs no `onClick` (the event is default-prevented) and carries `aria-disabled`;
 * a link loses its `href`, a button is natively `disabled`, a slot child leaves the Tab order and a
 * link child loses its `href` (`Slot`).
 */
export function InteractiveElement(props: InteractiveElementProps) {
  const { ref, disabled: disabledProp = false, onClick, ...rest } = props;
  const elementRef = useMergedRefs<HTMLElement>(ref);
  // Its own `disabled` or a disabled Fieldset around it.
  const off = useInheritedDisabledControl(disabledProp);
  const { disabled } = off;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  switch (rest.element) {
    case "link": {
      const { element: _, href, ...link } = rest;
      return (
        <a
          {...link}
          ref={elementRef}
          href={disabled ? undefined : href}
          // A link without `href` keeps its role, so the disabled state is announced on a link.
          role={disabled ? (link.role ?? "link") : link.role}
          aria-disabled={disabled || undefined}
          data-reachable-disabled={off.reachable || undefined}
          onClick={handleClick}
        />
      );
    }
    case "button": {
      const { element: _, type = "button", ...button } = rest;
      return (
        <button
          {...button}
          ref={elementRef}
          type={type}
          disabled={off.native}
          aria-disabled={off.ariaDisabled ?? button["aria-disabled"]}
          // A row of a roving list keeps `tabIndex={-1}` by the list's model, not out of reach.
          data-reachable-disabled={off.reachable || undefined}
          onClick={handleClick}
        />
      );
    }
    case "static": {
      const { element: _, ...div } = rest;
      return <div {...div} ref={elementRef} aria-disabled={disabled || undefined} />;
    }
    default: {
      const { element: _, children, ...slot } = rest;
      return (
        <Slot
          {...slot}
          ref={elementRef}
          aria-disabled={disabled || undefined}
          data-reachable-disabled={off.reachable || undefined}
          onClick={handleClick}
        >
          {children}
        </Slot>
      );
    }
  }
}
