/** External link with `target="_blank"` and `rel="noopener noreferrer"` passed to the native `<a>`. Use for links leaving the app; say in the text that a new tab opens. */
import { LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonExternalLinkExample() {
  return (
    <Typography.Root variant="body-m" tone="secondary">
      Подробности в{" "}
      <LinkButton.Root href="https://example.com/docs" target="_blank" rel="noopener noreferrer">
        документации (новая вкладка)
      </LinkButton.Root>
      .
    </Typography.Root>
  );
}
