import { AlertCircle } from "lucide-react";

import { Banner, Button, LinkButton } from "prime-ui-kit";

/** Past-due or failed payment: high emphasis, primary remediation + secondary help. */
export default function BillingAlertExample() {
  return (
    <Banner.Root
      aria-labelledby="billing-banner-title"
      role="region"
      status="error"
      variant="filled"
      onDismiss={() => {
        /* product: hide after acknowledge */
      }}
    >
      <Banner.Content>
        <Banner.Icon as={AlertCircle} aria-hidden />
        <Banner.Title id="billing-banner-title">Payment failed</Banner.Title>
        <Banner.Description>
          We could not charge your card ending in 4242. Update your payment method to avoid service
          interruption.
        </Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="primary">
            Update payment method
          </Button.Root>
          <LinkButton.Root href="/billing/support" size="s">
            Contact billing
          </LinkButton.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
