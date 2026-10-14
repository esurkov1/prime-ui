/** An inactive badge, a toggle chip off and on, a removable one and one that waits on a request — `disabled`, `pressed`, `onRemove`, `loading`. */
import { Badge, Typography } from "prime-ui-kit";

const noop = () => undefined;

export default function BadgeStatesExample() {
  return (
    <div>
      <div>
        <Badge.Root color="green" disabled>
          Оплачен
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
      <div>
        <Badge.Root pressed={false} onPressedChange={noop}>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          pressed: false
        </Typography>
      </div>
      <div>
        <Badge.Root pressed onPressedChange={noop}>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          pressed
        </Typography>
      </div>
      <div>
        <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={noop}>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          onRemove
        </Typography>
      </div>
      <div>
        <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={noop} disabled>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          onRemove · disabled
        </Typography>
      </div>
      <div>
        <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={noop} loading>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          onRemove · loading
        </Typography>
      </div>
    </div>
  );
}
