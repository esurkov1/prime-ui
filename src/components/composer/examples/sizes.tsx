/** One composer in every tier: field, buttons and the paperclip follow it — `size`. */
import { Composer, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function ComposerSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Composer.Root size={size} defaultValue="Счёт № 2187 оплачен" onSend={() => {}}>
            <Composer.Attach />
          </Composer.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
