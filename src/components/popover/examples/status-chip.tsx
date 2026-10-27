/** A status chip that opens its details: the badge is the trigger, keeps its tone while the panel is open and shows the time on a second line — `Popover.Trigger`, `Badge.Description`. */
import { Badge, Button, Icon, Popover } from "prime-ui-kit";

export default function PopoverStatusChipExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Badge.Root tone="success">
          <Badge.Dot />
          Синхронизировано с 1С
          <Badge.Description>12 минут назад</Badge.Description>
        </Badge.Root>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Обмен с 1С</Popover.Title>
          <Popover.Description>
            Выгружено 48 счетов и 112 платежей, ошибок нет. Следующий обмен в 14:30.
          </Popover.Description>
        </Popover.Header>
        <Popover.Actions>
          <Popover.Close>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.refresh" />
              </Button.Icon>
              Обменяться сейчас
            </Button.Root>
          </Popover.Close>
        </Popover.Actions>
      </Popover.Content>
    </Popover.Root>
  );
}
