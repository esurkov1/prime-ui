import { LogOut, Settings, UserRound } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Меню аккаунта: шапка с идентичностью, группа настроек, выход. */
export default function DropdownAccountMenuExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke" size="m">
          Аккаунт
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end" sameMinWidthAsTrigger>
        <Dropdown.Inset>
          <Dropdown.Block>
            <Dropdown.Header>
              <Dropdown.HeaderRow>
                <Dropdown.HeaderLeading>
                  <Avatar.Root size="l">
                    <Avatar.Fallback>ИП</Avatar.Fallback>
                  </Avatar.Root>
                </Dropdown.HeaderLeading>
                <Dropdown.HeaderMain>
                  <Dropdown.HeaderTitle>Иван Петров</Dropdown.HeaderTitle>
                  <Dropdown.HeaderDescription truncate>
                    ivan.petrov@example.com
                  </Dropdown.HeaderDescription>
                </Dropdown.HeaderMain>
              </Dropdown.HeaderRow>
              <Dropdown.Separator />
            </Dropdown.Header>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={UserRound} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Block>
          <Dropdown.Separator />
          <Dropdown.Item destructive>
            <Dropdown.ItemIcon as={LogOut} strokeWidth={2} />
            Выйти
          </Dropdown.Item>
        </Dropdown.Inset>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
