/** An icon before or after the label, and a square icon-only button — `Button.Icon`, `aria-label`. */
import { Button, Icon, Typography } from "prime-ui-kit";

export default function ButtonWithIconExample() {
  return (
    <div>
      <div>
        <Button.Root>
          <Button.Icon>
            <Icon name="action.upload" />
          </Button.Icon>
          Загрузить файл
        </Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          leading
        </Typography>
      </div>
      <div>
        <Button.Root variant="soft" tone="neutral">
          Далее
          <Button.Icon>
            <Icon name="nav.chevronRight" />
          </Button.Icon>
        </Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          trailing
        </Typography>
      </div>
      <div>
        <Button.Root variant="ghost" tone="neutral" aria-label="Копировать ссылку">
          <Button.Icon>
            <Icon name="action.copy" />
          </Button.Icon>
        </Button.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon-only
        </Typography>
      </div>
    </div>
  );
}
