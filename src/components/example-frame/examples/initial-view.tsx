/** A matrix frame that opens at phone width in the dark theme with no theme switch and counts code copies — `previewLayout`, `defaultViewport`, `defaultColorScheme`, `showThemeToggle`, `onCopy`. */
import { Badge, ExampleFrame, Typography } from "prime-ui-kit";
import * as React from "react";

const STATUSES = [
  { color: "gray", label: "Черновик" },
  { color: "blue", label: "На ревью" },
  { color: "green", label: "Опубликован" },
] as const;

const CODE = STATUSES.map(
  ({ color, label }) => `<Badge.Root color="${color}">${label}</Badge.Root>`,
).join("\n");

export default function ExampleFrameInitialViewExample() {
  const [copies, setCopies] = React.useState(0);

  return (
    <>
      <ExampleFrame
        code={CODE}
        previewLayout="matrix"
        defaultViewport="mobile"
        defaultColorScheme="dark"
        showThemeToggle={false}
        onCopy={() => setCopies((count) => count + 1)}
      >
        <div>
          {STATUSES.map(({ color, label }) => (
            <div key={color}>
              <Badge.Root color={color}>{label}</Badge.Root>
              <Typography as="span" variant="caption" tone="muted">
                {color}
              </Typography>
            </div>
          ))}
        </div>
      </ExampleFrame>
      <Typography variant="body-s" tone="secondary">
        Код скопирован: {copies}
      </Typography>
    </>
  );
}
