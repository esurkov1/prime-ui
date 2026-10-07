import * as React from "react";
import { useNavigate } from "react-router-dom";

import { CommandMenu } from "@/components/command-menu/CommandMenu";

import {
  PLAYGROUND_INTRO,
  PLAYGROUND_NAV,
  type PlaygroundPageEntry,
  pageRoute,
} from "../playgroundPages";

/** Opens/closes with ⌘K / Ctrl+K anywhere in the playground. */
export function usePlaygroundSearchHotkey(setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

const GROUPS: { id: string; label: string; pages: PlaygroundPageEntry[] }[] = [
  { id: "overview", label: "Обзор", pages: [PLAYGROUND_INTRO] },
  ...PLAYGROUND_NAV,
];

/** Global page search on the kit's CommandMenu; the index comes from `playgroundPages.tsx`. */
export function PlaygroundSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  const go = (page: PlaygroundPageEntry) => {
    onOpenChange(false);
    navigate(pageRoute(page.segment));
  };

  return (
    <CommandMenu.Root open={open} onOpenChange={onOpenChange}>
      <CommandMenu.Title className="playgroundVisuallyHidden">
        Поиск по playground
      </CommandMenu.Title>
      <CommandMenu.Input placeholder="Компонент, токен или проп…" aria-label="Поиск страниц" />
      <CommandMenu.List>
        <CommandMenu.Empty />
        {GROUPS.map((group) => (
          <CommandMenu.Group key={group.id} label={group.label}>
            {group.pages.map((page) => (
              <CommandMenu.Item
                key={page.segment}
                value={page.label}
                keywords={[page.description, group.label, ...page.keywords].join(" ")}
                onSelect={() => go(page)}
              >
                <CommandMenu.ItemIcon>
                  <page.icon />
                </CommandMenu.ItemIcon>
                <CommandMenu.ItemText description={page.description}>
                  {page.label}
                </CommandMenu.ItemText>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        ))}
      </CommandMenu.List>
    </CommandMenu.Root>
  );
}
