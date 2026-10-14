/** An icon before the label and an icon alone on the line named by `aria-label`; the divider sizes the icon — `Icon`, `aria-label`. */
import { Divider, Icon, Typography } from "prime-ui-kit";

export default function DividerWithIconExample() {
  return (
    <div>
      <div>
        <Divider>
          <Icon name="status.locked" />
          Безопасность
        </Divider>
        <Typography as="span" variant="caption" tone="muted">
          Icon · children
        </Typography>
      </div>
      <div>
        <Divider aria-label="Безопасность">
          <Icon name="status.locked" />
        </Divider>
        <Typography as="span" variant="caption" tone="muted">
          Icon · aria-label
        </Typography>
      </div>
    </div>
  );
}
