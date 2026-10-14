import {
  ScrollContainer,
  type ScrollContainerProps,
} from "@/components/scroll-container/ScrollContainer";

import { cx } from "./cx";
import styles from "./SwitcherScroller.module.css";

type SwitcherScrollerProps = Omit<
  ScrollContainerProps,
  "as" | "axis" | "scrollbar" | "anchor" | "onReachStart" | "onReachEnd" | "snap" | "lock"
>;

/**
 * The row of a switcher (foundation §9): a sideways `ScrollContainer` with a hidden bar — items
 * that do not fit scroll inside it, a vertical wheel scrolls it sideways, the hidden edges fade
 * (`edges`, default `fade`; `none` for a switcher that draws its own edge overlays). It never
 * wraps and never truncates: the host keeps its items at least as wide as their content. The
 * selected item comes into view with `revealInScroller` (`selectionIndicator`).
 */
export function SwitcherScroller({ edges = "fade", className, ...rest }: SwitcherScrollerProps) {
  return (
    <ScrollContainer
      {...rest}
      axis="horizontal"
      scrollbar="hidden"
      edges={edges}
      className={cx(styles.root, className)}
    />
  );
}
