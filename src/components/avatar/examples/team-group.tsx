/** Project members as an overlapping row with a «+N» cell; the group size goes to every member — `Avatar.Group`, `Avatar.Overflow`, `size`. */
import { Avatar, type PaletteColor } from "prime-ui-kit";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=128&h=128&fit=crop`;

/** Some members have a photo, some only initials — as in a real team. */
const MEMBERS: { name: string; initials: string; color: PaletteColor; src?: string }[] = [
  {
    name: "Анна Котова",
    initials: "АК",
    color: "blue",
    src: photo("1494790108377-be9c29b29330"),
  },
  { name: "Дмитрий Носов", initials: "ДН", color: "green" },
  {
    name: "Олег Смирнов",
    initials: "ОС",
    color: "orange",
    src: photo("1500648767791-00dcc994a43e"),
  },
  {
    name: "Мария Лебедева",
    initials: "МЛ",
    color: "pink",
    src: photo("1438761681033-6461ffad8d80"),
  },
];

export default function AvatarTeamGroupExample() {
  return (
    <Avatar.Group size="s" aria-label="Участники проекта: 7">
      {MEMBERS.map((member) => (
        <Avatar.Root key={member.initials} color={member.color}>
          {member.src ? <Avatar.Image src={member.src} alt={member.name} /> : null}
          <Avatar.Fallback>{member.initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.Overflow aria-label="Ещё 3 участника">+3</Avatar.Overflow>
    </Avatar.Group>
  );
}
