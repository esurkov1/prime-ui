/** The parent owns the value: a preset button replaces the tags and the count follows them — `value`, `onValueChange`. */
import { Button, TagSelect, type TagSelectOption, Typography } from "prime-ui-kit";
import * as React from "react";

const OPTIONS: TagSelectOption[] = [
  { value: "anna", label: "Анна Смирнова", color: "blue" },
  { value: "igor", label: "Игорь Петров", color: "green" },
  { value: "olga", label: "Ольга Ким", color: "purple" },
  { value: "pavel", label: "Павел Орлов", color: "orange" },
];

export default function TagSelectControlledExample() {
  const [team, setTeam] = React.useState<string[]>(["anna"]);

  return (
    <>
      <TagSelect label="Команда проекта" options={OPTIONS} value={team} onValueChange={setTeam} />
      <Typography.Root as="p" variant="body-s" tone="secondary">
        В команде: {team.length}
      </Typography.Root>
      <Button.Root variant="soft" tone="neutral" onClick={() => setTeam(["anna", "igor", "olga"])}>
        Добавить отдел дизайна
      </Button.Root>
    </>
  );
}
