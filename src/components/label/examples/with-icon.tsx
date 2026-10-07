/** A muted icon before the text, sized by the label — `Label.Icon`. */
import { Icon, Label, Typography } from "prime-ui-kit";

export default function LabelWithIconExample() {
  return (
    <div>
      <div>
        <Label.Root>
          <Label.Icon>
            <Icon name="field.email" />
          </Label.Icon>
          Рабочая почта
        </Label.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          m
        </Typography.Root>
      </div>
      <div>
        <Label.Root size="l">
          <Label.Icon>
            <Icon name="status.locked" />
          </Label.Icon>
          Пароль
        </Label.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          l
        </Typography.Root>
      </div>
    </div>
  );
}
