import type * as React from "react";

import { createComponentContext } from "@/internal/context";
import type { Selection } from "@/internal/messageList";

import type { MessageListLabels } from "./MessageList";

export type ChatLabels = MessageListLabels & {
  /** The status line of the header while the other side types (`Chat.Root typing`). */
  typing: string;
  /** The search button of the header and the name of the search field. */
  search: string;
  /** The placeholder of the search field. */
  searchPlaceholder: string;
  /** The place of the current match: `{index}` of `{count}`, counted from the newest. */
  matches: string;
  /** The search found nothing. */
  noMatches: string;
  /** The button that goes to the older match. */
  previousMatch: string;
  /** The button that goes to the newer match. */
  nextMatch: string;
  /** The name of the conversation when the header has no `Chat.Title`. */
  messages: string;
  /** The band above the first unread message of `items` (`Chat.Messages unread`). */
  unread: string;
};

/** What the parts of a chat share; `Chat.Root` owns it. */
export type ChatContextValue = {
  /** Selection mode: `undefined` — the chat has no selection (no triad on the root). */
  selected: Selection | undefined;
  setSelected: (next: Selection) => void;
  /** The search query, `null` while the search bar is closed. */
  search: string | null;
  setSearch: (next: string | null) => void;
  /** The messages that match the query, oldest first (reported by the list). */
  matches: readonly string[];
  setMatches: (values: readonly string[]) => void;
  /** The current match, counted from the newest (`0` — the newest). */
  matchIndex: number;
  setMatchIndex: (index: number) => void;
  /** The message the list brings into view: the current match while searching, else `current`. */
  current: string | null;
  /** The other side types. */
  typing: boolean;
  /** Brings a message into view and blinks the others around it (a pinned message's press). */
  jump: (value: string) => void;
  /** `Chat.SearchButton`: the focus goes back to it when the search closes from its field. */
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  /** The list hands its jump here. */
  revealRef: React.RefObject<((value: string) => void) | null>;
  /** The id of `Chat.Title`, the name of the list. */
  titleId: string;
  hasTitle: boolean;
  setHasTitle: (has: boolean) => void;
  labels: ChatLabels;
};

export const [ChatProvider, useChat] = createComponentContext<ChatContextValue>("Chat");
