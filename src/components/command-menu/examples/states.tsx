/** A disabled item never shows in the results, and an empty result speaks in the words of the task — `disabled`, `labels`. */
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Самара",
  "Краснодар",
];

export default function CommandMenuStatesExample() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Выбрать склад
      </Button.Root>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        aria-label="Выбор склада"
        labels={{ empty: "Склад не найден", emptyHint: "В этом городе склада пока нет" }}
      >
        <CommandMenu.Input placeholder="Город склада" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Склады">
            {CITIES.map((city) => (
              <CommandMenu.Item key={city} value={city} onSelect={close}>
                {city}
              </CommandMenu.Item>
            ))}
            <CommandMenu.Item value="Калининград" disabled onSelect={close}>
              Калининград — на ремонте
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
