import type * as React from "react";

import { cx } from "@/internal/cx";
import { useLabels } from "@/internal/labels";
import type { TextEntity } from "@/internal/richText";
import { RichText as RichTextBlocks } from "@/internal/richText";

import styles from "./RichText.module.css";

export type RichTextLabels = {
  /** The name of a masked `||spoiler||` until it is revealed. */
  spoiler: string;
};

export const RICH_TEXT_LABELS: RichTextLabels = {
  spoiler: "Скрытый текст",
};

export type {
  FormattedText,
  TextEntity,
  TextEntityType,
} from "@/internal/richText";
export { getRichTextSource, getTextEntities } from "@/internal/richText";

export type RichTextProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  children: string;
  entities?: readonly TextEntity[];
  labels?: Partial<RichTextLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Text in the chat's Markdown subset outside a message (a bot's welcome text, a template, a
 * comment): bold, italic, underline, strike, spoiler, inline and fenced code, links, quotes, kept
 * line breaks — or a plain text with its `entities` — the same rendering as `Message.Text`, as
 * React elements, never HTML. Takes the type of its host.
 */
export function RichText({
  children,
  entities,
  labels: labelsProp,
  className,
  ...rest
}: RichTextProps) {
  const labels = useLabels(RICH_TEXT_LABELS, labelsProp);
  return (
    <div className={cx(styles.root, className)} {...rest}>
      <RichTextBlocks source={children} entities={entities} labels={labels} />
    </div>
  );
}
