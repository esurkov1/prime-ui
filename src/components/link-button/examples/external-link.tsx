/** A link that leaves the app opens a new tab and says so in its text — `target`, `rel`. */
import { LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonExternalLinkExample() {
  return (
    <Typography variant="body-m" tone="secondary">
      Тарифы и лимиты описаны в{" "}
      <LinkButton href="https://example.com/docs" target="_blank" rel="noopener noreferrer">
        документации (новая вкладка)
      </LinkButton>
      .
    </Typography>
  );
}
