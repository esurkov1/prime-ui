import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { highlightTsx, type TsxTokenKind } from "@/internal/highlightTsx";
import type { Variant } from "@/internal/states";

import styles from "./CodeBlock.module.css";

export type CodeBlockColorScheme = "light" | "dark";

/** `soft` — filled panel with padding and the `code` text role; `ghost` — bare `pre` that inherits type and background from its host. */
export type CodeBlockVariant = Extract<Variant, "soft" | "ghost">;

export type CodeBlockProps = Omit<React.HTMLAttributes<HTMLPreElement>, "children"> & {
  /** TS/TSX source; highlighted by the kit's TS / TSX tokenizer. */
  code: string;
  /** Forces a theme for the block. Omit to follow the surrounding theme. */
  colorScheme?: CodeBlockColorScheme;
  /** Default `soft`. */
  variant?: CodeBlockVariant;
  ref?: React.Ref<HTMLPreElement>;
};

const TOKEN_CLASS: Record<TsxTokenKind, string | undefined> = {
  keyword: styles.keyword,
  string: styles.string,
  comment: styles.comment,
  number: styles.number,
  tag: styles.tag,
  text: undefined,
};

/** A static, highlighted TS/TSX snippet in `<pre><code>`. */
export function CodeBlock({
  code,
  colorScheme,
  variant = "soft",
  className,
  tabIndex,
  ref,
  ...rest
}: CodeBlockProps) {
  const preRef = useMergedRefs(ref);
  // The scroll region renders the `<pre>`: its element ref narrows to the pre it is.
  const scrollRef = React.useCallback(
    (node: HTMLElement | null) => preRef(node instanceof HTMLPreElement ? node : null),
    [preRef],
  );
  const tokens = React.useMemo(() => highlightTsx(code.trimEnd()), [code]);
  const content = (
    <code className={styles.code}>
      {tokens.map((token, index) => {
        const key = index;
        const tokenClass = TOKEN_CLASS[token.kind];
        return tokenClass ? (
          <span key={key} className={tokenClass}>
            {token.text}
          </span>
        ) : (
          token.text
        );
      })}
    </code>
  );
  const shared = {
    ...rest,
    className: cx(styles.root, className),
    "data-theme": colorScheme,
    "data-variant": variant,
  };

  if (variant === "ghost") {
    return (
      <pre {...shared} ref={ref} tabIndex={tabIndex}>
        {content}
      </pre>
    );
  }
  return (
    // `both`, not `horizontal`: a code block is text, not a strip — the vertical wheel stays the
    // page's. No edge cue: the block paints its own fill, which a fade would dissolve.
    <ScrollContainer
      {...shared}
      as="pre"
      axis="both"
      edges="none"
      ref={scrollRef}
      // A soft block scrolls horizontally: keep it reachable from the keyboard.
      tabIndex={tabIndex ?? 0}
    >
      {content}
    </ScrollContainer>
  );
}
