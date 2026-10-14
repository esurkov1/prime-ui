/** The palette while its first results load, with a disabled item that stays muted and is skipped by the arrows, and with an empty result in the words of the task — `loading`, `disabled`, `labels`. */
import { Button, CommandMenu, Typography } from "prime-ui-kit";
import * as React from "react";

type PaletteState = "loading" | "disabled" | "labels.empty";

const STATES: PaletteState[] = ["loading", "disabled", "labels.empty"];

const CITIES = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Самара"];

/** A city with no warehouse: the empty state opens on it. */
const NO_WAREHOUSE_QUERY = "Владивосток";

export default function CommandMenuStatesExample() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<PaletteState>("disabled");
  const [search, setSearch] = React.useState("");
  const close = () => setOpen(false);

  return (
    <>
      <div>
        {STATES.map((item) => (
          <div key={item}>
            <Button.Root
              variant="soft"
              tone="neutral"
              onClick={() => {
                setState(item);
                setSearch(item === "labels.empty" ? NO_WAREHOUSE_QUERY : "");
                setOpen(true);
              }}
            >
              Выбрать склад
            </Button.Root>
            <Typography as="span" variant="caption" tone="muted">
              {item}
            </Typography>
          </div>
        ))}
      </div>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        search={search}
        onSearchChange={setSearch}
        loading={state === "loading"}
        aria-label="Выбор склада"
        labels={{ empty: "Склад не найден", emptyHint: "В этом городе склада пока нет" }}
      >
        <CommandMenu.Input placeholder="Город склада" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          {state === "loading" ? null : (
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
          )}
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
