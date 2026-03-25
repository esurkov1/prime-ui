import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

/** Боковая панель в стилях ограничена по ширине (не шире 90vw); нижний лист — по высоте. */
export default function DrawerResponsiveSnippet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="ghost">
          Как ведёт себя ширина
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-rsp-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-rsp-title">Адаптив</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              У боковых панелей ширина задаётся стилями как <code>min(28rem, 90vw)</code>: на узком
              экране drawer сужается вместе с вьюпортом. У листов{" "}
              <code>side=&quot;bottom&quot;</code> и <code>top</code> высота ограничена (до 80vh),
              прокрутка — в <code>Drawer.Body</code>.
            </p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
