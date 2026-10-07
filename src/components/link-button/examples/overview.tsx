/** A link inside running text that keeps the text's size — `href`. */
import { LinkButton, Typography } from "prime-ui-kit";

export default function LinkButtonOverviewExample() {
  return (
    <Typography.Root variant="body-m" tone="secondary">
      Ссылка для входа отправлена на почту. Не пришло письмо?{" "}
      <LinkButton href="#resend">Отправить ещё раз</LinkButton>
    </Typography.Root>
  );
}
