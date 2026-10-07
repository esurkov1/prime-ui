/** Every ring color; `default` follows the surrounding text — `tone`. */
import { Spinner, Typography } from "prime-ui-kit";

const TONES = ["default", "secondary", "muted", "accent", "success", "warning", "danger"] as const;

export default function SpinnerVariantsExample() {
  return (
    <div>
      {TONES.map((tone) => (
        <div key={tone}>
          <Spinner tone={tone} />
          <Typography as="span" variant="caption" tone="muted">
            {tone}
          </Typography>
        </div>
      ))}
    </div>
  );
}
