/** A short exchange with a client: an incoming bubble and a run of two outgoing ones ending in the tail, the time and delivery ticks in the corner, a reply quote and a reaction you can toggle — `Message.Root`, `direction`, `position`, `time`, `status`, `Message.Text`, `Message.Reply`, `Message.Reactions`. */
import { Message, type MessageReaction } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LIKED: MessageReaction[] = [{ emoji: "👍", count: 1 }];

export default function MessageOverviewExample() {
  const [reactions, setReactions] = React.useState(LIKED);

  const toggle = (emoji: string) =>
    setReactions((current) => {
      const own = current.find((reaction) => reaction.emoji === emoji);
      if (!own) return [...current, { emoji, count: 1, selected: true }];
      return current
        .map((reaction) =>
          reaction.emoji === emoji
            ? {
                ...reaction,
                selected: !reaction.selected,
                count: reaction.count + (reaction.selected ? -1 : 1),
              }
            : reaction,
        )
        .filter((reaction) => reaction.count > 0);
    });

  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="14:02">
        <Message.Text>Добрый день! Счёт INV-2048 по заказу № 4821 пришёл без НДС.</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" position="first" time="14:05" status="read">
        <Message.Reply author="Игорь Петров" color="orange">
          Счёт INV-2048 по заказу № 4821 пришёл без НДС.
        </Message.Reply>
        <Message.Text>Проверили — исправленный счёт уже у вас на почте.</Message.Text>
      </Message.Root>
      <Message.Root
        direction="outgoing"
        position="last"
        time="14:05"
        status="sent"
        onReactionToggle={toggle}
      >
        <Message.Text>Если нужно, пришлю акт сверки.</Message.Text>
        <Message.Reactions items={reactions} />
      </Message.Root>
    </div>
  );
}
