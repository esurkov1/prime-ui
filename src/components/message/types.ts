import type { PaletteColor } from "@/internal/states";

/** Who wrote a message relative to the reader: `incoming` from others, `outgoing` from the reader. */
export type MessageDirection = "incoming" | "outgoing";

/** A person in the chat: a reactor of `MessageReaction.users`, the reader of `Chat.Messages`. */
export type MessageUser = {
  /** Stable id: the reader is matched by it. */
  id: string;
  /** The name read out in the chip's accessible name; the reader is «Вы». */
  name: string;
  /** Photo URL; without it the avatar shows the initials. */
  src?: string;
  /** Hue of the initials (`Avatar color`). Default `gray`. */
  color?: PaletteColor;
};

/** Where a message stands in a run of consecutive messages of one author. */
export type MessagePosition = "single" | "first" | "middle" | "last";

/** A reaction the reader can put: the emoji and its name for assistive tech («Нравится»). */
export type MessageReactionOption = { emoji: string; label: string };
