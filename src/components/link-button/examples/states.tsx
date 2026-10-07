/** A disabled link drops `href` and leaves the Tab order, in both tones — `disabled`. */
import { LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonStatesExample() {
  return (
    <div>
      <div>
        <LinkButton href="#export">Скачать выгрузку</LinkButton>
        <Typography.Root as="span" variant="caption" tone="muted">
          default
        </Typography.Root>
      </div>
      <div>
        <LinkButton href="#export" disabled>
          Скачать выгрузку
        </LinkButton>
        <Typography.Root as="span" variant="caption" tone="muted">
          disabled
        </Typography.Root>
      </div>
      <div>
        <LinkButton href="#export" tone="neutral" disabled>
          Скачать выгрузку
        </LinkButton>
        <Typography.Root as="span" variant="caption" tone="muted">
          neutral · disabled
        </Typography.Root>
      </div>
    </div>
  );
}
