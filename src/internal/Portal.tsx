import * as React from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  // Layout effect: the portal reaches the DOM before paint and before the parent's layout effects
  // (refs and positioning need it), one commit after its parent, so a portal opened inside
  // another one lands after it in the document. No reset on cleanup: a Suspense boundary that
  // hides the tree runs it, and content suspending inside the portal would mount and unmount it
  // in a loop.
  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}
