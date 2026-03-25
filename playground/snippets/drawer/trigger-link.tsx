import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { LinkButton } from "@/components/link-button/LinkButton";

/**
 * Drawer.Trigger ожидает ровно одного потомка с onClick — можно открыть панель с «ссылки».
 */
export default function DrawerTriggerLinkSnippet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <LinkButton.Root href="#" onClick={(e) => e.preventDefault()}>
          Условия участия
        </LinkButton.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-link-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-link-title">Краткие правила</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              Обработчик открытия добавляется к существующему <code>onClick</code> дочернего
              элемента; при <code>preventDefault</code> навигация не мешает открытию.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="primary">
                Понятно
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
