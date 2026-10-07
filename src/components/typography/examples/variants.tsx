/** Every text role from display to caption and code, then every text color on body text — `variant`, `tone`. */
import { Typography, type TypographyRole } from "prime-ui-kit";

const ROLES: TypographyRole[] = [
  "display-l",
  "display-m",
  "display-s",
  "heading-l",
  "heading-m",
  "heading-s",
  "title-l",
  "title-m",
  "title-s",
  "body-l",
  "body-m",
  "body-s",
  "caption",
  "code",
];

const TONES = ["default", "secondary", "muted", "accent", "success", "warning", "danger"] as const;

export default function TypographyVariantsExample() {
  return (
    <>
      {ROLES.map((variant) => (
        <div key={variant}>
          <div>
            <Typography.Root variant={variant}>Выручка за март</Typography.Root>
            <Typography.Root as="span" variant="caption" tone="muted">
              {variant}
            </Typography.Root>
          </div>
        </div>
      ))}
      {TONES.map((tone) => (
        <div key={tone}>
          <div>
            <Typography.Root variant="body-m" tone={tone}>
              Оплата по счёту № 4821 получена
            </Typography.Root>
            <Typography.Root as="span" variant="caption" tone="muted">
              body-m · {tone}
            </Typography.Root>
          </div>
        </div>
      ))}
    </>
  );
}
