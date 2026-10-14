/** A link inside running text takes the text's type and keeps its underline — `href`, `inline`. */
import { LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonOverviewExample() {
  return (
    <Typography variant="body-m" tone="secondary">
      Ссылка для входа отправлена на почту. Не пришло письмо?{" "}
      <LinkButton href="#resend" inline>
        Отправить ещё раз
      </LinkButton>
    </Typography>
  );
}
