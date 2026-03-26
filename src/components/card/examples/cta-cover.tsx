import { Button, Card, LinkButton } from "prime-ui-kit";

import bannerStyles from "./cover-banner.module.css";

/** CTA tile: title, supporting copy, actions. */
export function CtaCardExample() {
  return (
    <Card.Root variant="cta">
      <Card.Title>Export workspace report</Card.Title>
      <Card.CtaBody>
        Download a CSV of segments and metrics for the selected date range.
      </Card.CtaBody>
      <Card.Actions>
        <LinkButton.Root href="#" size="s">
          Download CSV
        </LinkButton.Root>
        <Button.Root mode="ghost" size="s" type="button" variant="neutral">
          Configure columns
        </Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}

/** Cover: decorative top region, then stack and primary action. */
export function CoverCardExample() {
  return (
    <Card.Root variant="cover">
      <Card.Cover aria-hidden>
        <div className={bannerStyles.banner} />
      </Card.Cover>
      <Card.Stack>
        <Card.Title>Spring campaign</Card.Title>
        <Card.Label>Reach and clicks — last 7 days</Card.Label>
        <Card.Description>Compared to the control group.</Card.Description>
      </Card.Stack>
      <Card.Actions>
        <Button.Root mode="filled" size="s" type="button" variant="primary">
          Open report
        </Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
