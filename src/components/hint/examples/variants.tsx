/** Status hints whose words carry the status and the color repeats it — `tone`. */
import { Hint, Icon, Typography } from "prime-ui-kit";

export default function HintVariantsExample() {
  return (
    <div>
      <div>
        <Hint.Root>Действует до 30 ноября.</Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          neutral
        </Typography>
      </div>
      <div>
        <Hint.Root tone="success">
          <Hint.Icon>
            <Icon name="status.success" />
          </Hint.Icon>
          ИНН проверен в ФНС.
        </Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          success
        </Typography>
      </div>
      <div>
        <Hint.Root tone="warning">
          <Hint.Icon>
            <Icon name="status.warning" />
          </Hint.Icon>
          Осталось 12 дней.
        </Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          warning
        </Typography>
      </div>
      <div>
        <Hint.Root tone="danger">
          <Hint.Icon>
            <Icon name="status.danger" />
          </Hint.Icon>
          Срок истёк 3 дня назад.
        </Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          danger
        </Typography>
      </div>
    </div>
  );
}
