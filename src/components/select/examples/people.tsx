/** People in the rows and the trigger: an avatar sized to the tier before the name, a role badge after it — `Avatar.Root`, `Badge.Root`, `renderValue`. */
import { Avatar, Badge, type PaletteColor, Select } from "prime-ui-kit";

type Member = {
  value: string;
  name: string;
  initials: string;
  color: PaletteColor;
  role?: string;
};

const TEAM: Member[] = [
  { value: "smirnova", name: "Анна Смирнова", initials: "АС", color: "blue", role: "Владелец" },
  { value: "kotov", name: "Борис Котов", initials: "БК", color: "green" },
  { value: "lebedeva", name: "Вера Лебедева", initials: "ВЛ", color: "purple", role: "Админ" },
  { value: "orlov", name: "Глеб Орлов", initials: "ГО", color: "orange" },
];

const BY_VALUE = new Map(TEAM.map((member) => [member.value, member]));

export default function SelectPeopleExample() {
  return (
    <Select.Root label="Ответственный" defaultValue="lebedeva" placeholder="Назначьте человека">
      <Select.Trigger>
        <Select.Value
          renderValue={({ value, label }) => {
            const member = BY_VALUE.get(value);
            return (
              <>
                <Avatar.Root color={member?.color}>
                  <Avatar.Fallback>{member?.initials}</Avatar.Fallback>
                </Avatar.Root>
                <Select.ItemText>{label}</Select.ItemText>
                {member?.role ? <Badge.Root color={member.color}>{member.role}</Badge.Root> : null}
              </>
            );
          }}
        />
      </Select.Trigger>
      <Select.Content>
        {TEAM.map((member) => (
          <Select.Item key={member.value} value={member.value}>
            <Avatar.Root color={member.color}>
              <Avatar.Fallback>{member.initials}</Avatar.Fallback>
            </Avatar.Root>
            <Select.ItemText>{member.name}</Select.ItemText>
            {member.role ? <Badge.Root color={member.color}>{member.role}</Badge.Root> : null}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
