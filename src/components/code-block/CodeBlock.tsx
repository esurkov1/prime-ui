import * as React from "react";

import { cx } from "@/internal/cx";
import { highlightTsxHtml } from "@/internal/highlightTsxHtml";

import styles from "./CodeBlock.module.css";

export type CodeBlockColorScheme = "light" | "dark";

export type CodeBlockRootProps = {
  /** Исходник TS/TSX; подсветка через `highlightTsxHtml`. */
  code: string;
  colorScheme?: CodeBlockColorScheme;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLPreElement>, "children" | "dangerouslySetInnerHTML">;

const CodeBlockRoot = React.forwardRef<HTMLPreElement, CodeBlockRootProps>(function CodeBlockRoot(
  { code, colorScheme = "light", className, ...rest },
  ref,
) {
  const html = React.useMemo(() => highlightTsxHtml(code.trimEnd()), [code]);

  return (
    <pre
      ref={ref}
      className={cx(styles.root, className)}
      data-theme={colorScheme}
      {...rest}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: разметка из доверенного `highlightTsxHtml(code)`
      dangerouslySetInnerHTML={{ __html: `<code class="${styles.code}">${html}</code>` }}
    />
  );
});
CodeBlockRoot.displayName = "CodeBlock.Root";

export const CodeBlock = {
  Root: CodeBlockRoot,
};
