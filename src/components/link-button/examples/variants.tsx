/** A regular link and a quiet one for footers and metadata — `tone`. */
import { LinkButton, Typography } from "prime-ui-kit";

const TONES = ["accent", "neutral"] as const;

export default function LinkButtonVariantsExample() {
  return (
    <div>
      {TONES.map((tone) => (
        <div key={tone}>
          <LinkButton href="#report" tone={tone}>
            Открыть отчёт
          </LinkButton>
          <Typography as="span" variant="caption" tone="muted">
            {tone}
          </Typography>
        </div>
      ))}
    </div>
  );
}
