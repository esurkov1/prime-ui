import * as React from "react";
import { ChevronDown } from "@/icons/glyphs/chevron-down";

import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import { rovingIndex } from "@/internal/rovingFocus";
import { touchTargetClass } from "@/internal/touchTarget";

import styles from "./MessageReactionBar.module.css";
import type { MessageReactionOption } from "./types";

/** The reactions of the bar, the first seven in its row, the rest behind «⌄». */
export const DEFAULT_REACTION_OPTIONS: readonly MessageReactionOption[] = [
  { emoji: "👍", label: "Нравится" },
  { emoji: "🔥", label: "Огонь" },
  { emoji: "🤣", label: "Смешно" },
  { emoji: "👌", label: "Отлично" },
  { emoji: "🤔", label: "Задумался" },
  { emoji: "😢", label: "Грустно" },
  { emoji: "😱", label: "В шоке" },
  { emoji: "❤️", label: "Сердце" },
  { emoji: "🎉", label: "Ура" },
  { emoji: "👏", label: "Аплодисменты" },
  { emoji: "🙏", label: "Спасибо" },
  { emoji: "👀", label: "Смотрю" },
  { emoji: "✅", label: "Готово" },
  { emoji: "💯", label: "На все сто" },
];

/** How many reactions the collapsed row shows. */
const ROW = 7;
/** The extra emoji stagger over at most this many steps: past it they go together. */
const STAGGER_MAX = 6;

export type ReactionBarLabels = {
  /** The name of the bar. */
  bar: string;
  /** The button that shows every reaction. */
  more: string;
};

type ReactionBarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The message's bubble: the bar opens above it. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** The bubble's side: the bar lines up with its start (incoming) or end (outgoing). */
  align: "start" | "end";
  options: readonly MessageReactionOption[];
  /** The reader's own reactions: their buttons are pressed. */
  selected: ReadonlySet<string>;
  onPick: (emoji: string) => void;
  /** Opened from the keyboard: focus moves to the first reaction. */
  focusOnOpen: boolean;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  labels: ReactionBarLabels;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

function Reaction({
  option,
  index,
  selected,
  picked,
  hovered,
  onHover,
  onPick,
  className,
}: {
  option: MessageReactionOption;
  index: number;
  className?: string;
  selected: boolean;
  picked: boolean;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      className={cx(styles.reaction, touchTargetClass, className)}
      style={{ "--i": index } as React.CSSProperties}
      aria-label={option.label}
      aria-pressed={selected}
      data-picked={picked || undefined}
      data-hovered={hovered || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onHover(true);
      }}
      onPointerLeave={() => onHover(false)}
      onClick={onPick}
    >
      <span className={styles.glyph} aria-hidden="true">
        {option.emoji}
      </span>
    </button>
  );
}

/**
 * The reaction bar of a message (a long press): a pill of quick reactions above the
 * bubble, «⌄» glides the rest open under them. A floating layer — it grows from the bubble, the
 * emoji arrive in a quick stagger, Escape and a press outside close it. A toolbar of toggle
 * buttons named by the reactions; arrows move between them.
 */
export function ReactionBar({
  open,
  onOpenChange,
  anchorRef,
  align,
  options,
  selected,
  onPick,
  focusOnOpen,
  closeOnOutsideClick,
  closeOnEscape,
  labels,
  onPointerEnter,
  onPointerLeave,
}: ReactionBarProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [picked, setPicked] = React.useState<string | null>(null);
  // The picked emoji stays swelled while the bar leaves; a new open starts from rest.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setPicked(null);
  }
  const floating = useFloatingLayer({
    open,
    onOpenChange,
    triggerRef: anchorRef,
    closeOnEscape,
    closeOnOutsideClick,
    side: "top",
    align,
    focusOnOpen,
    tabExit: "always",
    exitDuration: "base",
  });
  const quick = options.slice(0, ROW);
  const rest = options.slice(ROW);
  // The lifted emoji follows the pointer only while the bar is open: closing, the bar takes no
  // pointer events, and its state — hover, «⌄», the pressed reactions — stays as it was.
  const [hovered, setHovered] = React.useState<string | null>(null);
  const hover = (emoji: string) => (on: boolean) => {
    if (open) setHovered(on ? emoji : null);
  };
  const frozen = React.useRef(selected);
  if (open) frozen.current = selected;
  const shownSelected = frozen.current;
  const pick = (emoji: string) => {
    setPicked(emoji);
    onPick(emoji);
  };

  return (
    <FloatingPanel
      floating={floating}
      size="s"
      role="toolbar"
      aria-label={labels.bar}
      aria-orientation="horizontal"
      className={cx(fieldTierClass, styles.bar)}
      data-expanded={expanded || undefined}
      data-align={align}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={(event) => {
        // The folded rows stay mounted but inert: arrows skip them.
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])"),
        ).filter((button) => !button.closest("[inert]"));
        const index = buttons.indexOf(document.activeElement as HTMLElement);
        const next = rovingIndex(event.key, index, buttons.length, "both");
        if (next === null) return;
        event.preventDefault();
        buttons[next]?.focus();
      }}
    >
      <div className={styles.row}>
        {quick.map((option, index) => (
          <Reaction
            key={option.emoji}
            option={option}
            index={index}
            selected={shownSelected.has(option.emoji)}
            picked={picked === option.emoji}
            hovered={hovered === option.emoji}
            onHover={hover(option.emoji)}
            onPick={() => pick(option.emoji)}
            className={enterMotion.enter}
          />
        ))}
        {rest.length > 0 ? (
          <button
            type="button"
            className={cx(styles.reaction, styles.more, touchTargetClass, enterMotion.enter)}
            style={{ "--i": quick.length } as React.CSSProperties}
            aria-label={labels.more}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <span className={styles.glyph} aria-hidden="true">
              <ChevronDown animated={false} />
            </span>
          </button>
        ) : null}
      </div>
      {rest.length > 0 ? (
        // The rest glides open under the row (`Disclosure`) and back. Its emoji stay mounted both
        // ways, so the folding rows keep their content while the height glides to 0. `--n`: the
        // extra emoji in the stagger, at most `STAGGER_MAX` steps (the rest go together).
        <Disclosure
          open={expanded}
          className={styles.extra}
          style={{ "--n": Math.min(rest.length, STAGGER_MAX) } as React.CSSProperties}
          aria-hidden={!expanded || undefined}
          inert={!expanded}
        >
          <div className={styles.extraInner}>
            {rest.map((option, index) => (
              <Reaction
                key={option.emoji}
                option={option}
                index={index}
                selected={shownSelected.has(option.emoji)}
                picked={picked === option.emoji}
                hovered={hovered === option.emoji}
                onHover={hover(option.emoji)}
                onPick={() => pick(option.emoji)}
              />
            ))}
          </div>
        </Disclosure>
      ) : null}
    </FloatingPanel>
  );
}
