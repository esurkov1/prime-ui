/** Default help text next to an error and a hint under a disabled control — `invalid`, `disabled`. */
import { Hint, Typography } from "prime-ui-kit";

export default function HintStatesExample() {
  return (
    <div>
      <div>
        <Hint.Root>Формат: +7 900 000-00-00</Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <Hint.Root invalid>Введите 10 или 12 цифр ИНН.</Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          invalid
        </Typography>
      </div>
      <div>
        <Hint.Root disabled>Лимит задаётся тарифом.</Hint.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
    </div>
  );
}
