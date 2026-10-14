/** Every size tier: rows, text, icons and the search row follow it; match the density of the app — `size`. */
import { Button, CommandMenu, type ControlSize, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

const SIZES: ControlSize[] = ["xs", "s", "m", "l", "xl"];

const FILES = ["Договор поставки.pdf", "Счёт № 1042.pdf", "Акт сверки за сентябрь.pdf"];

export default function CommandMenuSizesExample() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<ControlSize>("m");

  return (
    <>
      <div>
        {SIZES.map((tier) => (
          <div key={tier}>
            <Button.Root
              variant="soft"
              tone="neutral"
              onClick={() => {
                setSize(tier);
                setOpen(true);
              }}
            >
              Найти файл
            </Button.Root>
            <Typography as="span" variant="caption" tone="muted">
              {tier}
            </Typography>
          </div>
        ))}
      </div>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        size={size}
        aria-label="Поиск файлов"
        labels={{ search: "Найти файл" }}
      >
        <CommandMenu.Input />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Файлы">
            {FILES.map((file) => (
              <CommandMenu.Item key={file} value={file} onSelect={() => setOpen(false)}>
                <CommandMenu.ItemIcon>
                  <Icon name="action.download" />
                </CommandMenu.ItemIcon>
                {file}
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
