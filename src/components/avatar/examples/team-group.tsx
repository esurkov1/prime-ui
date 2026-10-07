/** Project members as an overlapping row with a «+N» cell; the group size goes to every member — `Avatar.Group`, `Avatar.Overflow`, `size`. */
import { Avatar } from "prime-ui-kit";

const MEMBERS = [
  { initials: "АК", color: "blue" },
  { initials: "ДН", color: "green" },
  { initials: "ЖП", color: "orange" },
] as const;

export default function AvatarTeamGroupExample() {
  return (
    <Avatar.Group size="s" aria-label="Участники проекта: 6">
      {MEMBERS.map((member) => (
        <Avatar.Root key={member.initials} color={member.color}>
          <Avatar.Fallback>{member.initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.Overflow aria-label="Ещё 3 участника">+3</Avatar.Overflow>
    </Avatar.Group>
  );
}
