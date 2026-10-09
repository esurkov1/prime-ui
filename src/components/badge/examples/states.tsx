/** An inactive badge, a pressable toggle off and on, a removable one and one that waits on a request — `disabled`, `onPress`, `pressed`, `onRemove`, `loading`. */
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
        <Badge.Root color="blue" onPress={noop} pressed={false}>
          Москва
        </Badge.Root>
        <Typography as="span" variant="caption" tone="muted">
          onPress
        </Typography>
      </div>
      <div>
        <Badge.Root color="blue" onPress={noop} pressed>
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
