/** A required pick during an import: a stray click on the scrim does not close the palette, only Escape or a choice — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

const PROJECTS = ["Сайт компании", "Мобильное приложение", "Личный кабинет", "Платёжный шлюз"];

export default function CommandMenuDismissExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root onClick={() => setOpen(true)}>Импортировать задачи</Button.Root>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        closeOnOutsideClick={false}
        closeOnEscape
        aria-label="Проект для импорта"
      >
        <CommandMenu.Input placeholder="Куда импортировать" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Проекты">
            {PROJECTS.map((project) => (
              <CommandMenu.Item key={project} value={project} onSelect={() => setOpen(false)}>
                {project}
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint keys={["Esc"]}>
            Закрыть — клик по фону не закрывает
          </CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Root>
    </>
  );
}
