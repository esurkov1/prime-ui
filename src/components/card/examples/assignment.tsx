/** A rental's return with its assignee: the term in the title, the assignee picker first in the line under it, and the one secondary action as a labelled button beside the primary — `Card.Title`, `Card.Description`, `Badge.Avatar`, `Dropdown.Trigger`. */
import { Avatar, Badge, Button, Card, Dropdown, Icon, type PaletteColor } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Member = { id: string; name: string; initials: string; color: PaletteColor };

const TEAM: Member[] = [
  { id: "surkov", name: "Евгений Сурков", initials: "ЕС", color: "teal" },
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
];

const RENTAL = { due: "Вернуть 10 дек · через 50 дн.", issued: "выдан 21 окт, 15:43" };

export default function CardAssignmentExample() {
  const [memberId, setMemberId] = React.useState("surkov");
  const member = TEAM.find((item) => item.id === memberId) ?? TEAM[0];

  return (
    <div className={styles.panel}>
      <Card.Root>
        <Card.Header>
          <Card.Title>{RENTAL.due}</Card.Title>
          <Card.Description>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Badge.Root aria-label={`Ответственный: ${member.name}`}>
                  <Badge.Avatar>
                    <Avatar.Root color={member.color}>
                      <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                    </Avatar.Root>
                  </Badge.Avatar>
                  {member.name}
                </Badge.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {TEAM.map((item) => (
                  <Dropdown.Item key={item.id} onSelect={() => setMemberId(item.id)}>
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
            {RENTAL.issued}
          </Card.Description>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
            Отменить
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.check" />
            </Button.Icon>
            Принять возврат
          </Button.Root>
        </Card.Header>
      </Card.Root>
    </div>
  );
}
