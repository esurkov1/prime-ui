import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./sizes.module.css";

/** Закрытие только явным действием: без Escape и клика по подложке. */
function StrictDrawer() {
  return (
    <Drawer.Root closeOnEscape={false} closeOnOverlayClick={false}>
      <Drawer.Trigger>
        <Button.Root size="m" variant="error" mode="lighter">
          <Button.Icon>
            <Icon name="status.locked" />
          </Button.Icon>
          Строгий режим
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-state-strict-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-state-strict-title">Нужно подтвердить</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              Для этого сценария заданы <code>closeOnEscape=&#123;false&#125;</code> и{" "}
              <code>closeOnOverlayClick=&#123;false&#125;</code> на <code>Drawer.Root</code>.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Отмена
              </Button.Root>
            </Drawer.Close>
            <Button.Root size="m" variant="primary">
              Продолжить
            </Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/** Шапка без кнопки закрытия — выход только через подвал или программно. */
function NoHeaderCloseDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Без крестика в шапке
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-state-nox-title">
          <Drawer.Header showCloseButton={false}>
            <Drawer.Title id="drawer-state-nox-title">Кастомное закрытие</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              У <code>Drawer.Header</code> отключён стандартный крестик через{" "}
              <code>showCloseButton=&#123;false&#125;</code>.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root size="m" variant="primary">
                Закрыть
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default function DrawerStatesSnippet() {
  return (
    <div className={styles.row}>
      <StrictDrawer />
      <NoHeaderCloseDrawer />
    </div>
  );
}
