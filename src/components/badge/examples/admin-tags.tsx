import { Badge } from "prime-ui-kit";
import type { CSSProperties } from "react";

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-s)",
  alignItems: "center",
};

/** Environment and access hints on admin surfaces (non-removable labels; use Tag for removable chips). */
export default function BadgeAdminTagsExample() {
  return (
    <div style={row}>
      <Badge.Root color="orange" variant="filled">
        Staging
      </Badge.Root>
      <Badge.Root color="green" variant="light">
        Production
      </Badge.Root>
      <Badge.Root color="gray" variant="stroke">
        Internal
      </Badge.Root>
      <Badge.Root color="blue" variant="lighter">
        Beta
      </Badge.Root>
      <Badge.Root color="purple" variant="filled">
        Owner
      </Badge.Root>
      <Badge.Root color="yellow" variant="light">
        Feature flag: new billing
      </Badge.Root>
    </div>
  );
}
