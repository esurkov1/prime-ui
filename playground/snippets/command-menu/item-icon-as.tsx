import { Circle, Square, Triangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

export default function CommandMenuItemIconAsSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        ItemIcon с разным тегом
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenu.InputRow>
          <CommandMenu.Input placeholder="Иконки как SVG-компоненты…" aria-label="Поиск" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Полиморфный ItemIcon">
            <CommandMenu.Item value="круг" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Circle} strokeWidth={2} aria-hidden />
              Круг
            </CommandMenu.Item>
            <CommandMenu.Item value="квадрат" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Square} strokeWidth={2} aria-hidden />
              Квадрат
            </CommandMenu.Item>
            <CommandMenu.Item value="треугольник" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Triangle} strokeWidth={2} aria-hidden />
              Треугольник
            </CommandMenu.Item>
            <CommandMenu.Item value="метка" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as="span" aria-hidden>
                ●
              </CommandMenu.ItemIcon>
              Текстовая метка в span
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
