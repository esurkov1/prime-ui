import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function DrawerCompositionSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root onClick={() => setOpen(true)}>
        <Button.Icon>
          <Icon name="field.email" />
        </Button.Icon>
        Быстрый ответ
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Черновик сообщения"
        description="Проверьте тему перед отправкой"
        icon={<Icon name="field.email" tone="subtle" />}
        footer={
          <>
            <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(false)}>
              Отмена
            </Button.Root>
            <Button.Root variant="primary" onClick={() => setOpen(false)}>
              Отправить
            </Button.Root>
          </>
        }
      >
        <Input.Root label="Тема" hint="Видно получателю в списке писем">
          <Input.Wrapper>
            <Input.Field placeholder="Например: статус заказа" />
          </Input.Wrapper>
        </Input.Root>
      </Drawer>
    </>
  );
}
