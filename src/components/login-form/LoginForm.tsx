import * as React from "react";

import { Typography, type TypographyRole } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

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

const LoginFormSizeContext = React.createContext<ControlSize>("m");

export type LoginFormRootProps = {
  /** Tier of spacing and type. Pass the same `size` to the fields and buttons inside. Default `m`. */
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
} & React.HTMLAttributes<HTMLDivElement>;

const LoginFormRoot = React.forwardRef<HTMLDivElement, LoginFormRootProps>(function LoginFormRoot(
  { size = "m", align = "start", flat = false, className, children, ...rest },
  forwardedRef,
) {
  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ size, align, flat })}
    >
      <LoginFormSizeContext.Provider value={size}>{children}</LoginFormSizeContext.Provider>
    </div>
  );
});
LoginFormRoot.displayName = "LoginFormRoot";

export type LoginFormHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

/** Logo, title, description: icon-left / text-right by default, a centered column with Root `align="center"`. */
function LoginFormHeader({ className, children, ...rest }: LoginFormHeaderProps) {
  return (
    <header className={cx(styles.header, className)} {...rest}>
      {children}
    </header>
  );
}
LoginFormHeader.displayName = "LoginFormHeader";

export type LoginFormLogoProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Tile for the product mark or an icon (rounded accent square by default, round when `align="center"`). Decorative unless it has an `aria-label`. */
function LoginFormLogo({ className, children, ...rest }: LoginFormLogoProps) {
  return (
    <div className={cx(styles.logo, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormLogo.displayName = "LoginFormLogo";

export type LoginFormTitleProps = {
  /** Heading element. Default `h1`; use `h2` when the form sits inside a page that already has an `h1`. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children">;

function LoginFormTitle({ as = "h1", className, children, ...rest }: LoginFormTitleProps) {
  const size = React.useContext(LoginFormSizeContext);
  return (
    <Typography.Root
      as={as}
      variant={TITLE_ROLE[size]}
      className={cx(styles.title, className)}
      {...rest}
    >
      {children}
    </Typography.Root>
  );
}
LoginFormTitle.displayName = "LoginFormTitle";

export type LoginFormDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "children">;

function LoginFormDescription({ className, children, ...rest }: LoginFormDescriptionProps) {
  const size = React.useContext(LoginFormSizeContext);
  return (
    <Typography.Root
      as="p"
      variant={DESCRIPTION_ROLE[size]}
      tone="secondary"
      className={cx(styles.description, className)}
      {...rest}
    >
      {children}
    </Typography.Root>
  );
}
LoginFormDescription.displayName = "LoginFormDescription";

export type LoginFormBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Everything under the header: social buttons, divider, form, footer. */
function LoginFormBody({ className, children, ...rest }: LoginFormBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormBody.displayName = "LoginFormBody";

export type LoginFormSocialProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Column of full-width provider buttons (`Button.Root variant="outline" tone="neutral" fullWidth`). */
function LoginFormSocial({ className, children, ...rest }: LoginFormSocialProps) {
  return (
    <div className={cx(styles.social, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormSocial.displayName = "LoginFormSocial";

export type LoginFormFormProps = {
  className?: string;
  children?: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

/** The `<form>`: fields, then the submit button, one column with field → field spacing. Native submit and `onSubmit` work as usual. */
const LoginFormForm = React.forwardRef<HTMLFormElement, LoginFormFormProps>(function LoginFormForm(
  { className, children, ...rest },
  forwardedRef,
) {
  return (
    <form ref={forwardedRef} className={cx(styles.form, className)} {...rest}>
      {children}
    </form>
  );
});
LoginFormForm.displayName = "LoginFormForm";

export type LoginFormActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Column of full-width buttons: the primary action first, then a `ghost` back action. */
function LoginFormActions({ className, children, ...rest }: LoginFormActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
LoginFormActions.displayName = "LoginFormActions";

export type LoginFormFooterProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "children">;

/** Secondary line with a `LinkButton`: «Нет аккаунта? Зарегистрироваться». Follows Root `align`. */
function LoginFormFooter({ className, children, ...rest }: LoginFormFooterProps) {
  const size = React.useContext(LoginFormSizeContext);
  return (
    <Typography.Root
      as="p"
      variant={FOOTER_ROLE[size]}
      tone="secondary"
      className={cx(styles.footer, className)}
      {...rest}
    >
      {children}
    </Typography.Root>
  );
}
LoginFormFooter.displayName = "LoginFormFooter";

export const LoginForm = {
  Root: LoginFormRoot,
  Header: LoginFormHeader,
  Logo: LoginFormLogo,
  Title: LoginFormTitle,
  Description: LoginFormDescription,
  Body: LoginFormBody,
  Social: LoginFormSocial,
  Form: LoginFormForm,
  Actions: LoginFormActions,
  Footer: LoginFormFooter,
};
