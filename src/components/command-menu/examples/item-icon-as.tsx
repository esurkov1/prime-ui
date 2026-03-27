import { Circle, Square, Triangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

/**
 * `ItemIcon` `as` prop: SVG components or native `span` (playground `item-icon-as.tsx`).
 */
export default function CommandMenuExampleItemIconAs() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        ItemIcon polymorphism
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenu.InputRow>
          <CommandMenu.Input placeholder="Icons as components…" aria-label="Search" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Polymorphic ItemIcon">
            <CommandMenu.Item value="circle" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Circle} strokeWidth={2} aria-hidden />
              Circle
            </CommandMenu.Item>
            <CommandMenu.Item value="square" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Square} strokeWidth={2} aria-hidden />
              Square
            </CommandMenu.Item>
            <CommandMenu.Item value="triangle" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Triangle} strokeWidth={2} aria-hidden />
              Triangle
            </CommandMenu.Item>
            <CommandMenu.Item value="label" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as="span" aria-hidden>
                ●
              </CommandMenu.ItemIcon>
              Text mark in span
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
