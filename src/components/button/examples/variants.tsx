/** Every treatment on every tone — `variant`, `tone`. */
import { Button, Typography } from "prime-ui-kit";

const TONES = [
  { tone: "accent", label: "Сохранить" },
  { tone: "neutral", label: "Отмена" },
  { tone: "danger", label: "Удалить" },
] as const;

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export default function ButtonVariantsExample() {
  return (
    <>
      {TONES.map(({ tone, label }) => (
        <div key={tone}>
          {VARIANTS.map((variant) => (
            <div key={variant}>
              <Button.Root variant={variant} tone={tone}>
                {label}
              </Button.Root>
              <Typography as="span" variant="caption" tone="muted">
                {variant} · {tone}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
