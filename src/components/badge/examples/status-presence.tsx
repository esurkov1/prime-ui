import { Badge } from "prime-ui-kit";
import type { CSSProperties } from "react";

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-s)",
  alignItems: "center",
};

/**
 * Presence row: `variant="status"` sets `role="status"` and a built-in dot.
 * Use `label` when visible text is not enough for screen readers.
 */
export default function BadgeStatusPresenceExample() {
  return (
    <div style={row}>
      <Badge.Root variant="status" status="online" label="Alex Morgan is online" size="m">
        Online
      </Badge.Root>
      <Badge.Root variant="status" status="offline" label="Alex Morgan is offline" size="m">
        Offline
      </Badge.Root>
      <Badge.Root variant="status" status="away" label="Alex Morgan is away" size="m">
        Away
      </Badge.Root>
      <Badge.Root variant="status" status="busy" label="Alex Morgan is busy" size="m">
        Busy
      </Badge.Root>
    </div>
  );
}
