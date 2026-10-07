import * as React from "react";

import { cx } from "@/internal/cx";
import { highlightTsxHtml } from "@/internal/highlightTsxHtml";
import type { Variant } from "@/internal/states";

import styles from "./CodeBlock.module.css";

export type CodeBlockColorScheme = "light" | "dark";

/** `soft` — sunken panel with padding and the `code` text role; `ghost` — bare `pre` that inherits type and background from its host. */
export type CodeBlockVariant = Extract<Variant, "soft" | "ghost">;

export type CodeBlockRootProps = {
  /** TS/TSX source; highlighted with `highlightTsxHtml`. */
  code: string;
  /** Forces a theme for the block. Omit to follow the surrounding theme. */
  colorScheme?: CodeBlockColorScheme;
  variant?: CodeBlockVariant;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLPreElement>, "children" | "dangerouslySetInnerHTML">;

const CodeBlockRoot = React.forwardRef<HTMLPreElement, CodeBlockRootProps>(function CodeBlockRoot(
  { code, colorScheme, variant = "soft", className, tabIndex, ...rest },
  ref,
) {
  const html = React.useMemo(() => highlightTsxHtml(code.trimEnd()), [code]);

  return (
    <pre
      ref={ref}
      className={cx(styles.root, className)}
      data-theme={colorScheme}
      data-variant={variant}
      // A soft block scrolls horizontally: keep it reachable from the keyboard.
      tabIndex={tabIndex ?? (variant === "soft" ? 0 : undefined)}
      {...rest}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: markup from the trusted `highlightTsxHtml(code)` (escapes the source)
      dangerouslySetInnerHTML={{ __html: `<code class="${styles.code}">${html}</code>` }}
    />
  );
});
CodeBlockRoot.displayName = "CodeBlock.Root";

export const CodeBlock = {
  Root: CodeBlockRoot,
};
