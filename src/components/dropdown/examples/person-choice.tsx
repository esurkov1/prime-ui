/** The assignee of a deal picked from the team: each row leads with the person's avatar at the row's size, and the chosen one carries a check — `selected`, `Avatar.Root`. */
import { Avatar, Badge, Dropdown, type PaletteColor } from "prime-ui-kit";
import * as React from "react";

type Member = { id: string; name: string; initials: string; color: PaletteColor };

const TEAM: Member[] = [
  { id: "surkov", name: "Евгений Сурков", initials: "ЕС", color: "teal" },
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
];

export default function DropdownPersonChoiceExample() {
  const [memberId, setMemberId] = React.useState("surkov");
  const member = TEAM.find((item) => item.id === memberId) ?? TEAM[0];

  return (
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
          <Dropdown.Item
            key={item.id}
            selected={item.id === memberId}
            onSelect={() => setMemberId(item.id)}
          >
            <Avatar.Root color={item.color}>
              <Avatar.Fallback>{item.initials}</Avatar.Fallback>
            </Avatar.Root>
            {item.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
