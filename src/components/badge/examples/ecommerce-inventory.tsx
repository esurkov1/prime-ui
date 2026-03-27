import { Badge, Icon } from "prime-ui-kit";
import type { CSSProperties } from "react";

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-s)",
  alignItems: "center",
};

/** Product shelf: stock emphasis with `filled` / `light` / `lighter` / `stroke`. */
export default function BadgeEcommerceInventoryExample() {
  return (
    <div style={row}>
      <Badge.Root color="green" variant="filled">
        In stock
      </Badge.Root>
      <Badge.Root color="orange" variant="light">
        Low stock · 3 left
      </Badge.Root>
      <Badge.Root color="red" variant="lighter">
        Out of stock
      </Badge.Root>
      <Badge.Root color="purple" variant="stroke">
        Sale · 20% off
      </Badge.Root>
      <Badge.Root color="teal" variant="filled">
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Secure checkout
      </Badge.Root>
    </div>
  );
}
