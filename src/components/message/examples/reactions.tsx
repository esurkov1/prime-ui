/** Reactions under a message: each chip shows who reacted — up to three avatars, from four on two and «+N» — and a press on a chip, or a double tap on the message, puts or takes back your own at once while the request runs behind it — `Message.Reactions`, `users`, `onReactionToggle`. */
import { Message, type MessageReaction, type MessageUser } from "prime-ui-kit";
import * as React from "react";

const ME: MessageUser = {
  id: "me",
  name: "Вы",
  src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop",
};

const PETR: MessageUser = {
  id: "petr",
  name: "Пётр Соколов",
  src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
};
const DMITRY: MessageUser = {
  id: "dmitry",
  name: "Дмитрий Орлов",
  src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop",
};
const ANNA: MessageUser = {
  id: "anna",
  name: "Анна Котова",
  src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
};
const OLGA: MessageUser = { id: "olga", name: "Ольга Миронова", color: "pink" };

const INITIAL: MessageReaction[] = [
  { emoji: "🎉", count: 5, selected: true, users: [ME, PETR, ANNA, DMITRY, OLGA] },
  { emoji: "👍", count: 3, users: [DMITRY, ANNA, PETR] },
  { emoji: "🚀", count: 1, users: [OLGA] },
];

const SAVE_MS = 400;

/** The reader's reaction put or taken back: the count, the flag and the reader among `users`. */
const toggleOwn = (reactions: MessageReaction[], emoji: string): MessageReaction[] => {
  const own = reactions.find((reaction) => reaction.emoji === emoji);
  if (!own) return [...reactions, { emoji, count: 1, selected: true, users: [ME] }];
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

export default function MessageReactionsExample() {
  const [reactions, setReactions] = React.useState(INITIAL);

  // The server confirms after a moment; the chip has shown the new state since the press.
  const toggle = (emoji: string) =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setReactions((current) => toggleOwn(current, emoji));
        resolve();
      }, SAVE_MS);
    });

  return (
    <Message.Root time="17:40" onReactionToggle={toggle}>
      <Message.Author color="orange">Мария Лебедева</Message.Author>
      <Message.Text>Закрыли сделку с «Северным ветром» — 4,2 млн ₽ за год!</Message.Text>
      <Message.Reactions items={reactions} />
    </Message.Root>
  );
}
