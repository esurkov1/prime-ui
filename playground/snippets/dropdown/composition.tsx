import { BookOpen, HelpCircle, LayoutGrid, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Блоки, шапка с аватаром, подписи групп, иконки в строках и вложенная кнопка в трейлинге. */
export default function DropdownCompositionSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          Меню пользователя
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
                <Badge.Root color="red" variant="light" size="s">
                  PRO
                </Badge.Root>
              </Dropdown.HeaderTrailing>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>
          <Dropdown.Group>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={UserRound} strokeWidth={2} />
              Профиль и безопасность
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={LayoutGrid} strokeWidth={2} />
              Интеграции
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Block>

        <Dropdown.Block>
          <Dropdown.Group>
            <Dropdown.GroupLabel>Поддержка</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={BookOpen} strokeWidth={2} />
              Руководство
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={HelpCircle} strokeWidth={2} />
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
                <Button.Root size="s" variant="primary" mode="stroke">
                  Апгрейд
                </Button.Root>
              </Dropdown.HeaderTrailing>
            </Dropdown.HeaderRow>
            <Dropdown.Separator />
          </Dropdown.Header>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={LogOut} strokeWidth={2} />
            Выйти
          </Dropdown.Item>
        </Dropdown.Block>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
