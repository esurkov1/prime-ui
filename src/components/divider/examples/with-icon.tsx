/** An icon before the label and an icon alone on the line; the divider sizes it. */
import { Divider, Icon, Typography } from "prime-ui-kit";

export default function DividerWithIconExample() {
  return (
    <div>
      <div>
        <Divider>
          <Icon name="status.locked" />
          Безопасность
        </Divider>
        <Typography.Root as="span" variant="caption" tone="muted">
          иконка и подпись
        </Typography.Root>
      </div>
      <div>
        <Divider aria-label="Безопасность">
          <Icon name="status.locked" />
        </Divider>
        <Typography.Root as="span" variant="caption" tone="muted">
          только иконка
        </Typography.Root>
      </div>
    </div>
  );
}
