import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function DrawerCompositionSnippet() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root>
          <Button.Icon>
            <Icon surface="raised" name="field.email" />
          </Button.Icon>
          Быстрый ответ
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-comp-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-comp-title">Черновик сообщения</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Input.Root label="Тема" hint="Видно получателю в списке писем">
              <Input.Wrapper>
                <Input.Field placeholder="Например: статус заказа" />
              </Input.Wrapper>
            </Input.Root>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="neutral" mode="stroke">
                Отмена
              </Button.Root>
            </Drawer.Close>
            <Button.Root variant="primary">Отправить</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
