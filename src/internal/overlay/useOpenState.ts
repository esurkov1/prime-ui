import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";

type UseOpenStateOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * The owner is out of action (a disabled field): the layer is closed whatever `open` /
   * `defaultOpen` say, and nothing opens it; it opens again by itself once enabled, when its open
   * state still says so.
   */
  disabled?: boolean;
};

type OpenState = readonly [
  open: boolean,
  setOpen: (next: boolean | ((open: boolean) => boolean)) => void,
];

/**
 * The open triad of an overlay (`open` / `defaultOpen` / `onOpenChange`), controlled or not, with
 * the disabled gate every overlay owner shares: a disabled owner renders closed and ignores a
 * request to open; a request to close always goes through.
 */
export function useOpenState({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
}: UseOpenStateOptions): OpenState {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const disabledRef = React.useRef(disabled);
  disabledRef.current = disabled;

  const setOpen = React.useCallback(
    (next: boolean | ((open: boolean) => boolean)) => {
      setIsOpen((current) => {
        const value = typeof next === "function" ? next(current && !disabledRef.current) : next;
        return value && disabledRef.current ? current : value;
      });
    },
    [setIsOpen],
  );

  return [isOpen && !disabled, setOpen] as const;
}
