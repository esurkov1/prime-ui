/** CommandMenu.Dialog `size` xs → xl: rows, text, icons and the search row follow the tier. Match the density of the app. */
import { File, Folder } from "lucide-react";
import { Button, CommandMenu, type ControlSize } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SIZES: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function CommandMenuSizesExample() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<ControlSize>("m");
  const close = () => setOpen(false);

  return (
    <>
      <div className={styles.row}>
        {SIZES.map((s) => (
          <Button.Root
            key={s}
            size={s}
            variant="soft"
            tone="neutral"
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s}
          </Button.Root>
        ))}
      </div>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        size={size}
        aria-label="Поиск файлов"
        labels={{ search: "Найти файл" }}
      >
        <CommandMenu.InputRow>
          <CommandMenu.Input />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Файлы">
            <CommandMenu.Item value="договор" onSelect={close}>
              <CommandMenu.ItemIcon as={File} />
              Договор поставки.pdf
            </CommandMenu.Item>
            <CommandMenu.Item value="счёт" onSelect={close}>
              <CommandMenu.ItemIcon as={File} />
              Счёт № 1042.pdf
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Папки">
            <CommandMenu.Item value="бюджет" onSelect={close}>
              <CommandMenu.ItemIcon as={Folder} />
              <CommandMenu.ItemText description="Финансы / 2026 / Квартал 3">
                Бюджет на квартал
              </CommandMenu.ItemText>
            </CommandMenu.Item>
            <CommandMenu.Item value="презентация" onSelect={close}>
              <CommandMenu.ItemIcon as={Folder} />
              <CommandMenu.ItemText description="Маркетинг / Запуски">
                Презентация продукта
              </CommandMenu.ItemText>
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
