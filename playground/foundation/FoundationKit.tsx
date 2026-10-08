import type * as React from "react";

import { Card } from "@/components/card/Card";
import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";

import s from "./foundation.module.css";

/** A tile for token demos: the kit Card; `className` lays out the content inside it. */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <Card.Root {...rest} variant="cta" flat>
      <div className={cx(s.panel, className)}>{children}</div>
    </Card.Root>
  );
}

/** CSS variable name: Typography in the code role, secondary tone. */
export function TokenName({ children }: { children: string }) {
  return (
    <Typography as="span" variant="code" tone="secondary" className={s.tokenName}>
      {children}
    </Typography>
  );
}
