/** A long list that scrolls under the fixed search row, a disabled item hidden from results and custom empty-state texts. Use for picking one entry from a long list by typing. */
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Красноярск",
  "Самара",
  "Уфа",
  "Ростов-на-Дону",
  "Омск",
  "Краснодар",
  "Воронеж",
  "Пермь",
];

export default function CommandMenuStatesExample() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Выбрать склад
      </Button.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        aria-label="Выбор склада"
        labels={{ empty: "Склад не найден", emptyHint: "Склада в этом городе пока нет" }}
      >
        <CommandMenu.InputRow>
          <CommandMenu.Input placeholder="Город склада" aria-label="Город склада" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Склады">
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
      </CommandMenu.Dialog>
    </>
  );
}
