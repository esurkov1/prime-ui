import * as React from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  // Layout effect: the portal reaches the DOM before paint and before the parent's layout effects
  // (refs and positioning need it).
  React.useLayoutEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}
