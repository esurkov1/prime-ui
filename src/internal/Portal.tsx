import * as React from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  // useLayoutEffect: портал в DOM до paint и до layout-эффектов родителя (нужно для ref + позиционирования).
  React.useLayoutEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
}
