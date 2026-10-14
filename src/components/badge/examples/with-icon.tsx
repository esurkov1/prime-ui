/** A leading dot in the text color or its own hue, a leading or trailing icon and an icon-only square with a name — `Badge.Dot`, `color`, `Badge.Icon`, `aria-label`. */
import { Badge, Icon, Typography } from "prime-ui-kit";

export default function BadgeWithIconExample() {
  return (
    <div>
      <div>
        <Badge.Root color="green">
          <Badge.Dot />
          Активен
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          Badge.Dot
        </Typography>
      </div>
      <div>
        <Badge.Root>
          <Badge.Dot color="purple" />
          Проект «Север»
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          Badge.Dot · color
        </Typography>
      </div>
      <div>
        <Badge.Root color="purple">
          <Badge.Icon>
            <Icon name="status.locked" />
          </Badge.Icon>
          Приватный
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          Badge.Icon · start
        </Typography>
      </div>
      <div>
        <Badge.Root color="blue">
          Подробнее
          <Badge.Icon>
            <Icon name="nav.chevronRight" />
          </Badge.Icon>
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          Badge.Icon · end
        </Typography>
      </div>
      <div>
        <Badge.Root color="sky" aria-label="Почта">
          <Badge.Icon>
            <Icon name="field.email" />
          </Badge.Icon>
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon-only
        </Typography>
      </div>
    </div>
  );
}
