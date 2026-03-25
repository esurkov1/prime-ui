import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

/** В подвале колонка кнопок на всю ширину панели — удобно на узком drawer. */
export default function DrawerFullWidthSnippet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Действия на всю ширину
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-fw-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-fw-title">Подтвердите выбор</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p style={{ margin: 0 }}>
              Ниже — вертикальный стек с <code>fullWidth</code> у кнопок.
            </p>
          </Drawer.Body>
          <Drawer.Footer
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}
          >
            <Drawer.Close>
              <Button.Root size="m" variant="primary" fullWidth>
                Сохранить и применить
              </Button.Root>
            </Drawer.Close>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke" fullWidth>
                Вернуться
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
