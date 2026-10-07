/** An import closes only from its buttons, and not at all while it runs — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Drawer, Typography } from "prime-ui-kit";
import * as React from "react";

export default function DrawerDismissExample() {
  const [open, setOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  const start = () => {
    setImporting(true);
    window.setTimeout(() => {
      setImporting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      closeOnEscape={!importing}
    >
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Импорт товаров
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content size="s">
        <Drawer.Header showClose={!importing}>
          <Drawer.Title>Импорт товаров</Drawer.Title>
          <Drawer.Description>catalog-october.xlsx · 1 240 строк</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Typography variant="body-m" tone="secondary">
            Товары с совпадающим артикулом обновятся, новые добавятся в каталог.
          </Typography>
          <Typography variant="body-m" tone="secondary">
            Панель закрывается только кнопками: случайный клик мимо не сбросит настройки импорта.
          </Typography>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral" disabled={importing}>
              Отмена
            </Button.Root>
          </Drawer.Close>
          <Button.Root loading={importing} onClick={start}>
            Импортировать
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
