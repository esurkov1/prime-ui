/** Mailboxes in groups under their headings, as in the Sidebar and menus: a count is a plain number, the new ones a coloured badge — `List.Group`, `label`, `List.ItemCount`. */
import { Card, Icon, List } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const GROUPS = [
  {
    label: "Почта",
    boxes: [
      { id: "inbox", icon: "object.inbox", name: "Входящие", count: 8, fresh: true },
      { id: "sent", icon: "status.sent", name: "Отправленные", count: 124, fresh: false },
    ],
  },
  {
    label: "Обращения",
    boxes: [
      { id: "support", icon: "object.headset", name: "Поддержка", count: 3, fresh: true },
      { id: "billing", icon: "object.receipt", name: "Биллинг", count: 37, fresh: false },
      { id: "delivery", icon: "object.truck", name: "Доставка", count: 0, fresh: false },
    ],
  },
] as const;

export default function ListGroupsExample() {
  const [boxId, setBoxId] = React.useState("inbox");

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Ящики">
          {GROUPS.map((group) => (
            <List.Group key={group.label} label={group.label}>
              {group.boxes.map((box) => (
                <List.Item key={box.id} current={box.id === boxId} onClick={() => setBoxId(box.id)}>
                  <List.ItemIcon>
                    <Icon name={box.icon} />
                  </List.ItemIcon>
                  <List.ItemText>{box.name}</List.ItemText>
                  {box.count > 0 ? (
                    <List.ItemCount color={box.fresh ? "blue" : undefined}>
                      {box.count}
                    </List.ItemCount>
                  ) : null}
                </List.Item>
              ))}
            </List.Group>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
