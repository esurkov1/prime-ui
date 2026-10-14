import type * as React from "react";

import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";

/** API subtitle or nested heading inside a block: `title-s`, h3. */
export function DemoApiTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Typography {...props} as="h3" variant="title-s" />;
}

/** Lead text under a block title: `body-m`, secondary, reading width. */
export function DemoDescription({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Typography
      {...rest}
      as="p"
      variant="body-m"
      tone="secondary"
      className={cx("demoBlockDescription", className)}
    />
  );
}
