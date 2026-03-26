import { Wrench } from "lucide-react";

import { Banner, LinkButton } from "prime-ui-kit";

/** Scheduled downtime: visible but non-blocking; stroke keeps the bar calm on neutral chrome. */
export default function MaintenanceBannerExample() {
  return (
    <Banner.Root aria-label="Scheduled maintenance" role="region" status="warning" variant="stroke">
      <Banner.Content>
        <Banner.Icon as={Wrench} aria-hidden />
        <Banner.Title>Scheduled maintenance</Banner.Title>
        <Banner.Description>
          Brief downtime tonight, 02:00–03:00 UTC. APIs and the dashboard may be unavailable.
        </Banner.Description>
        <Banner.Actions>
          <LinkButton.Root href="/status" size="s">
            Status page
          </LinkButton.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
