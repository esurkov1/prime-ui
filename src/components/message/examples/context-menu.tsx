/** Long press: the reaction bar above the message and its menu below — a right click opens the menu, a long hover only the bar, `R` and Shift+F10 from the keyboard — `Message.Menu`, `onReactionToggle`. */
import { Dropdown, Icon, Message, type MessageReaction } from "prime-ui-kit";
import * as React from "react";

const REACTIONS: MessageReaction[] = [{ emoji: "🔥", count: 2 }];

export default function MessageContextMenuExample() {
  const [reactions, setReactions] = React.useState(REACTIONS);

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
    <Message.Root value="m1" time="20:19" onReactionToggle={toggle}>
      <Message.Text>Сентябрь и декабрь — самые продающие месяцы</Message.Text>
      <Message.Reactions items={reactions} />
      <Message.Menu>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.reply" />
          </Dropdown.ItemIcon>
          Ответить
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.copy" />
          </Dropdown.ItemIcon>
          Скопировать
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.pin" />
          </Dropdown.ItemIcon>
          Закрепить
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.forward" />
          </Dropdown.ItemIcon>
          Переслать
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.report" />
          </Dropdown.ItemIcon>
          Пожаловаться
        </Dropdown.Item>
        <Dropdown.Item tone="danger">
          <Dropdown.ItemIcon>
            <Icon name="action.delete" />
          </Dropdown.ItemIcon>
          Удалить
        </Dropdown.Item>
      </Message.Menu>
    </Message.Root>
  );
}
