/** A team's own reactions for approvals: a double tap or `L` puts the approval mark, a long press or `R` opens the team's set, and a chip toggles them back — `quickReaction`, `reactionOptions`, `onReactionToggle`. */
import { Card, Chat, Message, type MessageReaction, type MessageUser } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Request = {
  id: string;
  author: "anna" | "me";
  text: string;
  sentAt: Date;
  reactions: MessageReaction[];
};

const NOW = new Date(2026, 9, 8, 15, 0);

const ME: MessageUser = { id: "me", name: "Вы", color: "blue" };
const ANNA: MessageUser = { id: "anna", name: "Анна Котова", color: "orange" };

/** The approvals team's set: approve, look, ask, flag. The first is the quick one. */
const REACTION_OPTIONS = [
  { emoji: "✅", label: "Согласовано" },
  { emoji: "👀", label: "Смотрю" },
  { emoji: "❓", label: "Есть вопрос" },
  { emoji: "❗", label: "Срочно" },
] as const;

const QUICK_REACTION = REACTION_OPTIONS[0].emoji;

const REQUESTS: Request[] = [
  {
    id: "r1",
    author: "anna",
    text: "Прошу согласовать счёт **INV-2051** на 184 000 ₽ — оплата подрядчику за монтаж.",
    sentAt: new Date(2026, 9, 8, 14, 10),
    reactions: [{ emoji: "👀", count: 1, users: [ANNA] }],
  },
  {
    id: "r2",
    author: "anna",
    text: "И договор с «Гранитом» на 2027 год, скан во вложении к сделке.",
    sentAt: new Date(2026, 9, 8, 14, 12),
    reactions: [],
  },
  {
    id: "r3",
    author: "me",
    text: "Счёт смотрю, договор передал юристам.",
    sentAt: new Date(2026, 9, 8, 14, 20),
    reactions: [],
  },
];

/** The reader's reaction put or taken back, with the reader among the chip's `users`. */
const toggleOwn = (reactions: MessageReaction[], emoji: string): MessageReaction[] => {
  if (!reactions.some((reaction) => reaction.emoji === emoji)) {
    return [...reactions, { emoji, count: 1, selected: true, users: [ME] }];
  }
  return reactions
    .map((reaction) => {
      if (reaction.emoji !== emoji) return reaction;
      const others = (reaction.users ?? []).filter((user) => user.id !== ME.id);
      return {
        ...reaction,
        selected: !reaction.selected,
        count: reaction.count + (reaction.selected ? -1 : 1),
        users: reaction.selected ? others : [...others, ME],
      };
    })
    .filter((reaction) => reaction.count > 0);
};

export default function ChatReactionsExample() {
  const [requests, setRequests] = React.useState(REQUESTS);

  const toggle = (id: string, emoji: string) =>
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, reactions: toggleOwn(request.reactions, emoji) }
          : request,
      ),
    );

  // A reaction renders again only the request it changed.
  const renderMessage = (request: Request) => (
    <Message.Root
      direction={request.author === "me" ? "outgoing" : "incoming"}
      time={request.sentAt}
      status={request.author === "me" ? "read" : undefined}
      onReactionToggle={(emoji) => toggle(request.id, emoji)}
    >
      <Message.Text>{request.text}</Message.Text>
      {request.reactions.length ? <Message.Reactions items={request.reactions} /> : null}
    </Message.Root>
  );

  return (
    <Card.Root className={styles.short}>
      <Chat.Root>
        <Chat.Messages
          aria-label="Согласования"
          reader={ME}
          quickReaction={QUICK_REACTION}
          reactionOptions={REACTION_OPTIONS}
          items={requests}
          getKey={(request) => request.id}
          getAuthor={(request) => request.author}
          getDate={(request) => request.sentAt}
          renderMessage={renderMessage}
          now={NOW}
        />
      </Chat.Root>
    </Card.Root>
  );
}
