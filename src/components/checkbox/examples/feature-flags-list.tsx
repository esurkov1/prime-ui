import { Checkbox } from "prime-ui-kit";
import * as React from "react";

const FLAGS = [
  { id: "analytics", label: "Product analytics", hint: "Usage events to improve the app." },
  { id: "beta", label: "Beta features", hint: "Early access; may be unstable." },
  { id: "marketing", label: "Marketing emails", hint: "Tips and offers; no spam." },
] as const;

type FlagId = (typeof FLAGS)[number]["id"];

/**
 * Independent feature toggles: one checkbox per flag, shared controlled map.
 */
export function FeatureFlagsListExample() {
  const [flags, setFlags] = React.useState<Record<FlagId, boolean>>({
    analytics: true,
    beta: false,
    marketing: false,
  });

  function setFlag(id: FlagId, checked: boolean) {
    setFlags((prev) => ({ ...prev, [id]: checked }));
  }

  return (
    <>
      {FLAGS.map((f) => (
        <Checkbox.Root
          key={f.id}
          name={`flag_${f.id}`}
          value="on"
          checked={flags[f.id]}
          onChange={(e) => setFlag(f.id, e.target.checked)}
        >
          <Checkbox.Label>{f.label}</Checkbox.Label>
          <Checkbox.Hint>{f.hint}</Checkbox.Hint>
        </Checkbox.Root>
      ))}
    </>
  );
}
