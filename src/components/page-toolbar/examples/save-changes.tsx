/** A settings page: sections of the form on the left, the save action with the number of changes at the end of the top row — never a sticky bar at the bottom of a phone screen — `PageToolbar.Actions`. */
import { Button, PageToolbar, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

const SECTIONS = [
  { value: "profile", label: "Профиль" },
  { value: "billing", label: "Оплата" },
  { value: "team", label: "Команда" },
];

const CHANGES = 3;

export default function PageToolbarSaveChangesExample() {
  const [section, setSection] = React.useState("profile");

  return (
    <PageToolbar.Root aria-label="Настройки">
      <PageToolbar.Sections>
        <SegmentedControl.Root
          fullWidth
          value={section}
          onValueChange={setSection}
          aria-label="Раздел настроек"
        >
          {SECTIONS.map((item) => (
            <SegmentedControl.Item key={item.value} value={item.value}>
              {item.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </PageToolbar.Sections>
      <PageToolbar.Actions>
        <Button.Root variant="ghost" tone="neutral">
          Отменить
        </Button.Root>
        <Button.Root>Сохранить {CHANGES} изменения</Button.Root>
      </PageToolbar.Actions>
    </PageToolbar.Root>
  );
}
