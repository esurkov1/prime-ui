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
      <Badge.Root color="orange" variant="filled" size="m">
        Staging
      </Badge.Root>
      <Badge.Root color="green" variant="light" size="m">
        Production
      </Badge.Root>
      <Badge.Root color="gray" variant="stroke" size="m">
        Internal
      </Badge.Root>
      <Badge.Root color="blue" variant="lighter" size="m">
        Beta
      </Badge.Root>
      <Badge.Root color="purple" variant="filled" size="m">
        Owner
      </Badge.Root>
      <Badge.Root color="yellow" variant="light" size="m">
        Feature flag: new billing
      </Badge.Root>
    </div>
  );
}
