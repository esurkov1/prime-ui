/** A sunken panel and a bare block that takes type and background from its host — `variant`. */
import { CodeBlock, Typography } from "prime-ui-kit";

const SAMPLE = `const total = formatPrice(14990);`;

const VARIANTS = ["soft", "ghost"] as const;

export default function CodeBlockVariantsExample() {
  return (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <CodeBlock code={SAMPLE} variant={variant} />
          <Typography.Root as="span" variant="caption" tone="muted">
            {variant}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
