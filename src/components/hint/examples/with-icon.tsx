/** A leading icon centred on the first line, in the default and the error state — `Hint.Icon`. */
import { Hint, Icon, Typography } from "prime-ui-kit";

export default function HintWithIconExample() {
  return (
    <div>
      <div>
        <Hint.Root>
          <Hint.Icon>
            <Icon name="field.email" />
          </Hint.Icon>
          На этот адрес придёт код подтверждения.
        </Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <Hint.Root invalid>
          <Hint.Icon>
            <Icon name="status.danger" />
          </Hint.Icon>
          Адрес уже занят другим аккаунтом.
        </Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          invalid
        </Typography>
      </div>
    </div>
  );
}
