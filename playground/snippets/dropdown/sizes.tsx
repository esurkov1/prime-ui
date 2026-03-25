import { Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

export default function DropdownSizesSnippet() {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            size=&quot;s&quot;
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="s">
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Edit} strokeWidth={2} />
            Редактировать
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Copy} strokeWidth={2} />
            Дублировать
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item destructive>
            <Dropdown.ItemIcon as={Trash2} strokeWidth={2} />
            Удалить
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            size=&quot;m&quot;
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="m">
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Edit} strokeWidth={2} />
            Редактировать
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Copy} strokeWidth={2} />
            Дублировать
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item destructive>
            <Dropdown.ItemIcon as={Trash2} strokeWidth={2} />
            Удалить
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="l" variant="neutral" mode="stroke">
            size=&quot;l&quot;
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="l">
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Edit} strokeWidth={2} />
            Редактировать
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Copy} strokeWidth={2} />
            Дублировать
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item destructive>
            <Dropdown.ItemIcon as={Trash2} strokeWidth={2} />
            Удалить
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="xl" variant="neutral" mode="stroke">
            size=&quot;xl&quot;
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content size="xl">
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Edit} strokeWidth={2} />
            Редактировать
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Copy} strokeWidth={2} />
            Дублировать
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item destructive>
            <Dropdown.ItemIcon as={Trash2} strokeWidth={2} />
            Удалить
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
