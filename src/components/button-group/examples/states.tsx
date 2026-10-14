/** A plain segment, a toggled one, a disabled one and a group in error — `pressed`, `disabled`, `invalid`. */
import { ButtonGroup, Typography } from "prime-ui-kit";

export default function ButtonGroupStatesExample() {
  return (
    <div>
      <div>
        <ButtonGroup.Root aria-label="Статус задачи">
          <ButtonGroup.Item>Открыта</ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <ButtonGroup.Root aria-label="Статус задачи">
          <ButtonGroup.Item pressed>В работе</ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          pressed
        </Typography>
      </div>
      <div>
        <ButtonGroup.Root aria-label="Статус задачи">
          <ButtonGroup.Item disabled>Архив</ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
      <div>
        <ButtonGroup.Root aria-label="Статус задачи" invalid>
          <ButtonGroup.Item>Открыта</ButtonGroup.Item>
          <ButtonGroup.Item>В работе</ButtonGroup.Item>
        </ButtonGroup.Root>
        <Typography as="span" variant="caption" tone="muted">
          invalid
        </Typography>
      </div>
    </div>
  );
}
