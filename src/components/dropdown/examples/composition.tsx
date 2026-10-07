/** Account menu: header with avatar, title, truncated email and badge, grouped items with icons, a plan block with a button. Use for the user menu in an app header. */
import { BookOpen, HelpCircle, LayoutGrid, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, Badge, Button, Dropdown } from "prime-ui-kit";

export default function DropdownCompositionExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Анна Петрова
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Block>
          <Dropdown.Header>
            <Dropdown.HeaderRow>
              <Dropdown.HeaderLeading>
                <Avatar.Root size="l">
                  <Avatar.Fallback>АП</Avatar.Fallback>
                </Avatar.Root>
              </Dropdown.HeaderLeading>
              <Dropdown.HeaderMain>
                <Dropdown.HeaderTitle>Анна Петрова</Dropdown.HeaderTitle>
                <Dropdown.HeaderDescription truncate>
                  anna.petrova@example.com
                </Dropdown.HeaderDescription>
              </Dropdown.HeaderMain>
              <Dropdown.HeaderTrailing>
                <Badge.Root color="purple" size="s">
                  PRO
                </Badge.Root>
              </Dropdown.HeaderTrailing>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>
          <Dropdown.Group>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={UserRound} />
              Профиль и безопасность
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={LayoutGrid} />
              Интеграции
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>

        <Dropdown.Separator />
        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Поддержка</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={BookOpen} />
              Руководство
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={HelpCircle} />
              Справочный центр
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>

        <Dropdown.Separator />
        <Dropdown.Block>
          <Dropdown.Header>
            <Dropdown.HeaderRow>
              <Dropdown.HeaderMain>
                <Dropdown.HeaderTitle>Бесплатный план</Dropdown.HeaderTitle>
                <Dropdown.HeaderDescription>12 000 просмотров в месяц</Dropdown.HeaderDescription>
              </Dropdown.HeaderMain>
              <Dropdown.HeaderTrailing alignSelf="center">
                <Button.Root variant="soft" size="s">
                  Апгрейд
                </Button.Root>
              </Dropdown.HeaderTrailing>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={LogOut} />
            Выйти
          </Dropdown.Item>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
