/** An icon before or after the text; `Icon` without a size takes the link tier — `Icon`. */
import { Icon, LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonWithIconExample() {
  return (
    <div>
      <div>
        <LinkButton href="#support">
          <Icon name="field.email" />
          Написать в поддержку
        </LinkButton>
        <Typography.Root as="span" variant="caption" tone="muted">
          leading
        </Typography.Root>
      </div>
      <div>
        <LinkButton href="#projects">
          Все проекты
          <Icon name="nav.chevronRight" />
        </LinkButton>
        <Typography.Root as="span" variant="caption" tone="muted">
          trailing
        </Typography.Root>
      </div>
    </div>
  );
}
