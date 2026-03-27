import { Card, Icon, ProgressCircle, Typography } from "prime-ui-kit";

/** KPI tile with a ring in `Card.Media` — extended pattern; no matching `circle-*` playground snippet. */
export default function DashboardRingExample() {
  return (
    <Card.Root variant="mini-media">
      <Card.IconBox aria-hidden>
        <Icon name="nav.layoutGrid" aria-hidden />
      </Card.IconBox>
      <Card.Stack>
        <Card.Label>Quarter target</Card.Label>
        <Card.Value>68%</Card.Value>
      </Card.Stack>
      <Card.Media>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBlock: "var(--prime-sys-spacing-s)",
          }}
        >
          <ProgressCircle.Root
            value={68}
            max={100}
            size="m"
            label="Quarter target, 68 percent complete"
          >
            <Typography.Root as="span" variant="body-small" weight="medium">
              68%
            </Typography.Root>
          </ProgressCircle.Root>
        </div>
      </Card.Media>
    </Card.Root>
  );
}
