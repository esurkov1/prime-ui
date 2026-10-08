import { Moon, SquareStack, Sun } from "lucide-react";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Tooltip } from "@/components/tooltip/Tooltip";

import { PLAYGROUND_PREVIEW_SURFACES, usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

/** Header actions: the theme switch and the preview surface menu, as small soft icon buttons. */
export function PlaygroundHeaderControls() {
  const { scheme, toggleScheme } = usePlaygroundTheme();
  const { surface, setSurface } = usePlaygroundPreviewTheme();
  const themeLabel = scheme === "dark" ? "Светлая тема" : "Тёмная тема";

  return (
    <>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral" aria-label={themeLabel} onClick={toggleScheme}>
            <Button.Icon>{scheme === "dark" ? <Sun /> : <Moon />}</Button.Icon>
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>{themeLabel}</Tooltip.Content>
      </Tooltip.Root>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="soft" tone="neutral" aria-label="Фон превью">
            <Button.Icon>
              <SquareStack />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content side="bottom" align="end">
          <Dropdown.Group label="Фон превью">
            {PLAYGROUND_PREVIEW_SURFACES.map((entry) => (
              <Dropdown.CheckboxItem
                key={entry.value}
                checked={entry.value === surface}
                onCheckedChange={() => setSurface(entry.value)}
              >
                {entry.label}
              </Dropdown.CheckboxItem>
            ))}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
