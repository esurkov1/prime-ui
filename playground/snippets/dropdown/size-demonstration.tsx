import { Settings, User } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Демонстрация всех аспектов размеров: отступы, шрифты, иконки, высота пунктов. */
export default function DropdownSizeDemonstrationSnippet() {
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            Размер S
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="s">
          <Dropdown.Group>
            <Dropdown.GroupLabel>Группа S</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={User} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item>Пункт без иконки</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Размер M (по умолчанию)
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="m">
          <Dropdown.Group>
            <Dropdown.GroupLabel>Группа M</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={User} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item>Пункт без иконки</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="l" variant="neutral" mode="stroke">
            Размер L
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="l">
          <Dropdown.Group>
            <Dropdown.GroupLabel>Группа L</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={User} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item>Пункт без иконки</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="xl" variant="neutral" mode="stroke">
            Размер XL
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="xl">
          <Dropdown.Group>
            <Dropdown.GroupLabel>Группа XL</Dropdown.GroupLabel>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={User} strokeWidth={2} />
              Профиль
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Settings} strokeWidth={2} />
              Настройки
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Separator />
          <Dropdown.Item>Пункт без иконки</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
