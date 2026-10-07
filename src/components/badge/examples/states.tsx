/** An inactive badge, a pressable toggle off and on, and a removable one — `disabled`, `onPress`, `pressed`, `onRemove`. */
import { Badge, Typography } from "prime-ui-kit";

const noop = () => undefined;

export default function BadgeStatesExample() {
  return (
    <div>
      <div>
        <Badge.Root color="green" disabled>
          Оплачен
        </Badge.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          disabled
        </Typography.Root>
      </div>
      <div>
        <Badge.Root color="blue" onPress={noop} pressed={false}>
          Москва
        </Badge.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          onPress
        </Typography.Root>
      </div>
      <div>
        <Badge.Root color="blue" onPress={noop} pressed>
          Москва
        </Badge.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          pressed
        </Typography.Root>
      </div>
      <div>
        <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={noop}>
          Москва
        </Badge.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          onRemove
        </Typography.Root>
      </div>
      <div>
        <Badge.Root labels={{ remove: "Убрать «Москва»" }} onRemove={noop} disabled>
          Москва
        </Badge.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          onRemove · disabled
        </Typography.Root>
      </div>
    </div>
  );
}
