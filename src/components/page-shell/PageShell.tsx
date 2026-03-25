import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./PageShell.module.css";

export type PageShellRootProps = {
  fillViewport?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const PageShellRoot = React.forwardRef<HTMLDivElement, PageShellRootProps>(function PageShellRoot(
  { fillViewport = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({ "fill-viewport": fillViewport ? true : undefined })}
    >
      {children}
    </div>
  );
});
PageShellRoot.displayName = "PageShell.Root";

export type PageShellNavAreaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

function PageShellNavArea({ className, children, ...rest }: PageShellNavAreaProps) {
  return (
    <aside className={cx(styles.navArea, className)} {...rest}>
      {children}
    </aside>
  );
}
PageShellNavArea.displayName = "PageShell.NavArea";

export type PageShellContentAreaProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const PageShellContentArea = React.forwardRef<HTMLElement, PageShellContentAreaProps>(
  function PageShellContentArea({ className, children, ...rest }, forwardedRef) {
    return (
      <main ref={forwardedRef} className={cx(styles.contentArea, className)} {...rest}>
        {children}
      </main>
    );
  },
);
PageShellContentArea.displayName = "PageShell.ContentArea";

export const PageShell = {
  Root: PageShellRoot,
  NavArea: PageShellNavArea,
  ContentArea: PageShellContentArea,
};
