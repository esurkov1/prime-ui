import { Sparkles } from "lucide-react";

import { Banner, Button } from "prime-ui-kit";

/** Product promo: feature palette, lighter fill, compact actions. */
export default function FeaturePromoExample() {
  return (
    <Banner.Root
      aria-labelledby="feature-banner-title"
      role="region"
      status="feature"
      variant="lighter"
      size="m"
      onDismiss={() => {
        /* product: persist dismissal (localStorage / profile flag) */
      }}
    >
      <Banner.Content>
        <Banner.Icon as={Sparkles} aria-hidden />
        <Banner.Title id="feature-banner-title">New: shared workspaces</Banner.Title>
        <Banner.Description>
          Invite teammates, assign roles, and keep projects in one place. Available on Pro and
          Enterprise.
        </Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="primary">
            Try workspaces
          </Button.Root>
          <Button.Root mode="ghost" size="s" type="button" variant="neutral">
            What&apos;s new
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
