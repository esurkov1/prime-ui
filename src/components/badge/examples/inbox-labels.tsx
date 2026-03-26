import { Badge, Icon } from "prime-ui-kit";
import type { CSSProperties } from "react";

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-s)",
  alignItems: "center",
};

/** Thread metadata: priority, unread-style emphasis, and channel type with `Badge.Icon`. */
export default function BadgeInboxLabelsExample() {
  return (
    <div style={row}>
      <Badge.Root color="red" variant="filled" size="m">
        Urgent
      </Badge.Root>
      <Badge.Root color="blue" variant="light" size="m">
        Unread
      </Badge.Root>
      <Badge.Root color="gray" variant="stroke" size="m">
        Archived
      </Badge.Root>
      <Badge.Root color="sky" variant="lighter" size="m">
        <Badge.Icon>
          <Icon name="field.email" />
        </Badge.Icon>
        Newsletter
      </Badge.Root>
      <Badge.Root color="purple" variant="light" size="m">
        <Badge.Dot />
        VIP list
      </Badge.Root>
    </div>
  );
}
