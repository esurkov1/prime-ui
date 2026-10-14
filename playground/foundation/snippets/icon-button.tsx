import { Button, Icon } from "prime-ui-kit";

// Без size иконка берёт размер хоста: здесь — уровень кнопки.
export const create = (
  <Button.Root size="l">
    <Button.Icon>
      <Icon name="action.add" />
    </Button.Icon>
    Создать заказ
  </Button.Root>
);
