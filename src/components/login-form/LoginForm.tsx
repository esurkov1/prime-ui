import * as React from "react";

import { Card } from "@/components/card/Card";
import { Typography, type TypographyRole } from "@/components/typography/Typography";
import { AutofillScope } from "@/internal/autofill";
import { useHostTier, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconBoxStyles } from "@/internal/iconBox";
import type { ControlSize } from "@/internal/states";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";

import styles from "./LoginForm.module.css";

/*
 * A `start` header is the surface's header row: the title, the description and the footer line take
 * the frame roles of the letter (internal/surfaceFrame). A `center` header is its own column and
 * keeps a larger scale of the title and the description.
 */
const CENTER_TITLE_ROLE: Record<ControlSize, TypographyRole> = {
  xs: "title-s",
  s: "title-m",
  m: "title-l",
  l: "heading-s",
  xl: "heading-m",
};

const CENTER_DESCRIPTION_ROLE: Record<ControlSize, TypographyRole> = {
  xs: "body-s",
  s: "body-s",
  m: "body-m",
  l: "body-m",
  xl: "body-l",
};

/** Tier of the text parts: the root's `size`, provided through the control-size context. */
const useLoginFormSize = (): ControlSize => useOptionalControlSize() ?? "m";

/** The header layout of the root: the logo of a `start` header is the kit's icon tile. */
const AlignContext = React.createContext<"center" | "start">("start");

export type LoginFormRootProps = {
  size?: ControlSize;
  align?: "center" | "start";
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function LoginFormRoot({
  size: sizeProp,
  align = "start",
  className,
  children,
  ref,
  ...rest
}: LoginFormRootProps) {
  // The surface is a Card (layer fill, radius, depth, whisper); the root caps its width and the
  // content lays out the form's rhythm inside the card's padding.
  const { size, provide } = useHostTier(sizeProp);
  return (
    <div
      ref={ref}
      {...rest}
      className={cx(surfaceFrameClass, styles.root, className)}
      {...toDataAttributes({ size, align, frame: size })}
    >
      <Card.Root size={size}>
        <div className={styles.content}>
          <AlignContext value={align}>{provide(children)}</AlignContext>
        </div>
      </Card.Root>
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

/**
 * Tile for the product mark or an icon (rounded accent square by default, round when
 * `align="center"`). Decorative unless it has an `aria-label`: then it is an image of the product
 * mark (`role="img"`), since a plain `<div>` cannot carry a name.
 */
function LoginFormLogo({ className, children, ...rest }: LoginFormLogoProps) {
  const align = React.useContext(AlignContext);
  const size = useLoginFormSize();
  return (
    <div
      role={rest["aria-label"] ? "img" : undefined}
      className={cx(styles.logo, align === "start" && iconBoxStyles.tile, className)}
      data-tone={align === "start" ? "accent" : undefined}
      data-size={align === "start" ? size : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
LoginFormLogo.displayName = "LoginForm.Logo";

export type LoginFormTitleProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children">;

function LoginFormTitle({ as = "h1", className, children, ...rest }: LoginFormTitleProps) {
  const size = useLoginFormSize();
  const align = React.useContext(AlignContext);
  const Tag = as;
  return align === "start" ? (
    <Tag className={cx(FRAME_TITLE[size], styles.title, className)} {...rest}>
      {children}
    </Tag>
  ) : (
    <Typography
      as={as}
      variant={CENTER_TITLE_ROLE[size]}
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
  const align = React.useContext(AlignContext);
  return align === "start" ? (
    <p
      className={cx(FRAME_DESCRIPTION[size], styles.description, styles.quiet, className)}
      {...rest}
    >
      {children}
    </p>
  ) : (
    <Typography
      as="p"
      variant={CENTER_DESCRIPTION_ROLE[size]}
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

/**
 * The `<form>`: fields, then the submit button, one column with field → field spacing. Native
 * submit and `onSubmit` work as usual. Autofill is the point of a sign-in form: a kit field inside
 * it without an `autoComplete` token is left to the browser and the password managers.
 */
function LoginFormForm({ className, children, ref, ...rest }: LoginFormFormProps) {
  return (
    <form ref={ref} className={cx(styles.form, className)} {...rest}>
      <AutofillScope>{children}</AutofillScope>
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
    <p className={cx(FRAME_DESCRIPTION[size], styles.footer, styles.quiet, className)} {...rest}>
      {children}
    </p>
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
