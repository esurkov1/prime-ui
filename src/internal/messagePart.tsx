import * as React from "react";

import type { SurfaceDepth } from "./surfaceDepth";

/**
 * The contract between a chat message (`Message.Root`) and the content parts inside it (text,
 * media, a video circle, voice, file, location, contact, link preview).
 *
 * A content part renders its own box only. It never knows about bubbles, tails, reactions or where
 * the meta goes: it declares what it is once, on its component type (`defineMessagePart`), and the
 * message decides the shell, the tail, the meta and the edges from the declarations of its children
 * (fragments flattened, `null` / `false` ignored). Inside, a part reads `useMessagePart()` for the
 * two things only the message can hand it: the meta's spacer or its overlay.
 */
export type MessagePartSpec = {
  /**
   * The shell the part asks for: `fill` — a bubble (text, voice, file, a card); `media` — a picture,
   * a video or an album: alone in a message it is the shell itself (no backing, the meta on a pill
   * over it, reactions under it); `round` — a video circle (no backing, reactions under it).
   */
  shell: "fill" | "media" | "round";
  /**
   * How the meta (time, «изменено», ticks) stands with the part when it ends the message: `inline`
   * — the part renders `spacer` at the end of its last line and the meta sits over it in the
   * bubble's bottom-end corner; `overlay` — the part renders `overlay` (the meta on a dark pill)
   * inside its own positioned box, at the bottom-end corner.
   */
  meta: "inline" | "overlay";
  /** A picture: a bubble holding it curls no tail. */
  picture?: boolean;
  /**
   * The part's box reaches the bubble's edges: its root carries `data-message-bleed` (the message
   * pulls it over the bubble's inline padding) and the message drops its block padding on the side
   * the part starts or ends the bubble. The part pads its own text with `--message-pad-x` /
   * `--message-pad-y`.
   */
  bleed?: boolean;
  /**
   * The part sets its own inline size (a picture, a card): the bubble is exactly as wide as it
   * (`min-content`), a caption wraps under it.
   */
  sized?: boolean;
  /**
   * An estimate of the part's block size in px from its props, before it renders: the row's
   * `contain-intrinsic-size` while it is off screen (`content-visibility: auto`).
   */
  estimate?: (props: never) => number;
  /**
   * The text a chat's search looks in, from the part's props (a text, a transcript). Only what the
   * part also marks as a match (`useMessageHighlight`).
   */
  text?: (props: never) => string;
};

const SPECS = new WeakMap<object, MessagePartSpec>();

/** Declares `component` a message content part. Returns it, for `export const X = define(…)`. */
export function defineMessagePart<C extends object>(component: C, spec: MessagePartSpec): C {
  SPECS.set(component, spec);
  return component;
}

/** The declaration of an element type, or `null` for anything that is not a content part. */
export function messagePartOf(type: unknown): MessagePartSpec | null {
  return (
    (typeof type === "function" || (typeof type === "object" && type !== null)
      ? SPECS.get(type)
      : undefined) ?? null
  );
}

export type MessagePartContextValue = {
  /**
   * For the part that ends the message with `meta: "inline"`: an invisible copy of the meta to put
   * at the very end of the part's last line (inline, after the last word). It reserves the meta's
   * room; the meta wraps to a line of its own only when the last line is too long. Render it in
   * one place at a time. `null` anywhere else.
   */
  spacer: React.ReactNode;
  /**
   * For the part that ends the message with `meta: "overlay"`: the meta on a dark pill, absolutely
   * positioned at the bottom-end corner of its nearest positioned ancestor — put it inside the
   * picture's box or the circle. `null` anywhere else.
   */
  overlay: React.ReactNode;
  /**
   * The depth of an incoming bubble, in both directions: a box that must stay neutral inside an
   * outgoing message (the gaps of an album) sets `data-depth={neutralDepth}` and paints
   * `--prime-color-layer-current`.
   */
  neutralDepth: SurfaceDepth;
  /**
   * State of the message's parts that outlives its row: a long conversation renders only the rows
   * near the view, so a row that scrolls away unmounts and mounts again. One entry per part kind
   * (`memory.get("transcript")`); `null` outside a list.
   */
  memory?: Map<string, unknown> | null;
  /**
   * Call right before the part changes its own size in place (a transcript that opens or closes):
   * the conversation keeps what the reader sees still while it plays, so the message grows past
   * the edge instead of pushing the list. `undefined` outside a list.
   */
  holdPosition?: () => void;
  /**
   * A press inside the part starts (`true`) or ends: the whole message presses as one (a picture
   * with its caption), never the part alone. `undefined` outside a message.
   */
  press?: (pressed: boolean) => void;
};

const NO_PART: MessagePartContextValue = {
  spacer: null,
  overlay: null,
  neutralDepth: 1,
  memory: null,
};

const MessagePartContext = React.createContext<MessagePartContextValue | null>(null);
MessagePartContext.displayName = "MessagePartContext";

/** `Message.Root` wraps each content part in it. */
export const MessagePartProvider = MessagePartContext.Provider;

/** What the message hands this part; outside a message every slot is empty. */
export function useMessagePart(): MessagePartContextValue {
  return React.useContext(MessagePartContext) ?? NO_PART;
}

/** Whether the caller renders inside a chat message. */
export function useInMessage(): boolean {
  return React.useContext(MessagePartContext) !== null;
}

/**
 * The search query of a chat (`Chat.Search`): texts and transcripts mark its matches.
 * Its own context: typing a query re-renders the texts, not the messages.
 */
export const MessageHighlightContext = React.createContext("");
MessageHighlightContext.displayName = "MessageHighlightContext";

/** The query a chat text marks; `""` outside a chat. */
export function useMessageHighlight(): string {
  return React.useContext(MessageHighlightContext);
}
