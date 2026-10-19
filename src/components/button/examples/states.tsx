/** Disabled and loading next to the default; the spinner keeps the width — `disabled`, `loading`. */
import { Button, Icon, Typography } from "prime-ui-kit";

export default function ButtonStatesExample() {
  return (
    <div>
      <div>
        <Button.Root>Сохранить</Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <Button.Root disabled>Сохранить</Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
      <div>
        <Button.Root loading>Сохранить</Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          loading
        </Typography>
      </div>
      <div>
        <Button.Root variant="soft" tone="neutral" loading>
          <Button.Icon>
            <Icon name="action.upload" />
          </Button.Icon>
          Файл
        </Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          loading · Button.Icon
        </Typography>
      </div>
    </div>
  );
}
