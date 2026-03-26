import type * as React from "react";

import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";

type TypographyRootProps = React.ComponentProps<typeof Typography.Root>;

/** Заголовок блока примера на странице плейграунда (под заголовком страницы). */
export function DemoSectionTitle({
  className,
  children,
  ...rest
}: Omit<TypographyRootProps, "as" | "variant" | "weight" | "tracking">) {
  return (
    <Typography.Root
      {...rest}
      as="h4"
      variant="heading-section"
      weight="semibold"
      tracking="tight"
      className={className}
    >
      {children}
    </Typography.Root>
  );
}

/** Подзаголовок API или вложенный заголовок внутри блока. */
export function DemoApiTitle({
  className,
  children,
  ...rest
}: Omit<TypographyRootProps, "as" | "variant" | "weight" | "tracking">) {
  return (
    <Typography.Root
      {...rest}
      as="h5"
      variant="heading-subsection"
      weight="semibold"
      tracking="tight"
      className={className}
    >
      {children}
    </Typography.Root>
  );
}

/** Вводный текст под заголовком блока: основной кегль, приглушённый тон. */
export function DemoDescription({
  className,
  children,
  ...rest
}: Omit<TypographyRootProps, "as" | "variant" | "tone">) {
  return (
    <Typography.Root
      {...rest}
      as="p"
      variant="body-default"
      tone="muted"
      className={cx("demoBlockDescription", className)}
    >
      {children}
    </Typography.Root>
  );
}
