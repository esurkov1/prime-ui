/** Disabled and loading next to the default; the spinner keeps the width — `disabled`, `loading`. */
import { Button, Icon, Typography } from "prime-ui-kit";

export default function ButtonStatesExample() {
  return (
    <div>
      <div>
        <Button.Root>Сохранить</Button.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          default
        </Typography.Root>
      </div>
      <div>
        <Button.Root disabled>Сохранить</Button.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          disabled
        </Typography.Root>
      </div>
      <div>
        <Button.Root loading>Сохранить</Button.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          loading
        </Typography.Root>
      </div>
      <div>
        <Button.Root variant="outline" tone="neutral" loading>
          <Button.Icon>
            <Icon name="action.upload" />
          </Button.Icon>
          Загрузить
        </Button.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          loading · Button.Icon
        </Typography.Root>
      </div>
    </div>
  );
}
