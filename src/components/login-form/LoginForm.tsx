import type * as React from "react";

import { Typography, type TypographyRole } from "@/components/typography/Typography";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";

import styles from "./LoginForm.module.css";

const TITLE_ROLE: Record<ControlSize, TypographyRole> = {
  xs: "title-s",
  s: "title-m",
  m: "title-l",
  l: "heading-s",
  xl: "heading-m",
};

const DESCRIPTION_ROLE: Record<ControlSize, TypographyRole> = {
  xs: "body-s",
  s: "body-s",
  m: "body-m",
  l: "body-m",
  xl: "body-l",
};

const FOOTER_ROLE: Record<ControlSize, TypographyRole> = {
  xs: "caption",
  s: "body-s",
  m: "body-s",
  l: "body-m",
  xl: "body-m",
};

/** Tier of the text parts: the root's `size`, provided through the control-size context. */
const useLoginFormSize = (): ControlSize => useOptionalControlSize() ?? "m";

export type LoginFormRootProps = {
  /** Tier of spacing and type; fields and buttons inside without their own `size` take it. Default `m`. */
  size?: ControlSize;
  /**
   * Header layout. `start` (default): the Modal-header layout — a rounded accent tile on the left,
   * title over description on its right. `center`: round logo above centered text.
   */
  align?: "center" | "start";
  /** Removes the card shadow, e.g. inside a modal or on a plain page. No border in either case. */
  flat?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function LoginFormRoot({
  size = "m",
  align = "start",
  flat = false,
  className,
  children,
  ref,
  ...rest
}: LoginFormRootProps) {
  const depth = useNestedSurfaceDepth();
  return (
    <div
      ref={ref}
      {...rest}
      className={cx(styles.root, className)}
      data-depth={depth}
      {...toDataAttributes({ size, align, flat })}
    >
      <SurfaceDepthProvider value={depth}>
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </SurfaceDepthProvider>
    </div>
  );
}
LoginFormRoot.displayName = "LoginForm.Root";

export type LoginFormHeaderProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & React.HTMLAttributes<HTMLElement>;

/** Logo, title, description: icon-left / text-right by default, a centered column with Root `align="center"`. */
function LoginFormHeader({ className, children, ...rest }: LoginFormHeaderProps) {
  return (
    <header className={cx(styles.header, className)} {...rest}>
      {children}
    </header>
  );
}
LoginFormHeader.displayName = "LoginForm.Header";

export type LoginFormLogoProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

/** Tile for the product mark or an icon (rounded accent square by default, round when `align="center"`). Decorative unless it has an `aria-label`. */
function LoginFormLogo({ className, children, ...rest }: LoginFormLogoProps) {
  return (
    <div className={cx(styles.logo, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormLogo.displayName = "LoginForm.Logo";

export type LoginFormTitleProps = {
  /** Heading element. Default `h1`; use `h2` when the form sits inside a page that already has an `h1`. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children">;

function LoginFormTitle({ as = "h1", className, children, ...rest }: LoginFormTitleProps) {
  const size = useLoginFormSize();
  return (
    <Typography
      as={as}
      variant={TITLE_ROLE[size]}
      className={cx(styles.title, className)}
      {...rest}
    >
      {children}
    </Typography>
  );
}
LoginFormTitle.displayName = "LoginForm.Title";

export type LoginFormDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLParagraphElement>;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "children">;

function LoginFormDescription({ className, children, ...rest }: LoginFormDescriptionProps) {
  const size = useLoginFormSize();
  return (
    <Typography
      as="p"
      variant={DESCRIPTION_ROLE[size]}
      tone="secondary"
      className={cx(styles.description, className)}
      {...rest}
    >
      {children}
    </Typography>
  );
}
LoginFormDescription.displayName = "LoginForm.Description";

export type LoginFormBodyProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

/** Everything under the header: social buttons, divider, form, footer. */
function LoginFormBody({ className, children, ...rest }: LoginFormBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormBody.displayName = "LoginForm.Body";

export type LoginFormFormProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
} & React.FormHTMLAttributes<HTMLFormElement>;

/** The `<form>`: fields, then the submit button, one column with field → field spacing. Native submit and `onSubmit` work as usual. */
function LoginFormForm({ className, children, ref, ...rest }: LoginFormFormProps) {
  return (
    <form ref={ref} className={cx(styles.form, className)} {...rest}>
      {children}
    </form>
  );
}
LoginFormForm.displayName = "LoginForm.Form";

export type LoginFormActionsProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Column of full-width buttons: provider buttons above the form, or the primary action first
 * with a `ghost` back action under it.
 */
function LoginFormActions({ className, children, ...rest }: LoginFormActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormActions.displayName = "LoginForm.Actions";

export type LoginFormFooterProps = {
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLParagraphElement>;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "children">;

/** Secondary line with a `LinkButton`: «Нет аккаунта? Зарегистрироваться». Follows Root `align`. */
function LoginFormFooter({ className, children, ...rest }: LoginFormFooterProps) {
  const size = useLoginFormSize();
  return (
    <Typography
      as="p"
      variant={FOOTER_ROLE[size]}
      tone="secondary"
      className={cx(styles.footer, className)}
      {...rest}
    >
      {children}
    </Typography>
  );
}
LoginFormFooter.displayName = "LoginForm.Footer";

export const LoginForm = {
  Root: LoginFormRoot,
  Header: LoginFormHeader,
  Logo: LoginFormLogo,
  Title: LoginFormTitle,
  Description: LoginFormDescription,
  Body: LoginFormBody,
  Form: LoginFormForm,
  Actions: LoginFormActions,
  Footer: LoginFormFooter,
};
