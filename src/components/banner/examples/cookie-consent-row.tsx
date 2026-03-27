import { Cookie } from "lucide-react";

import { Banner, Button, LinkButton } from "prime-ui-kit";

/** Inline consent row: actions for accept / preferences; optional dismiss defers to product policy. */
export default function CookieConsentRowExample() {
  return (
    <Banner.Root
      aria-labelledby="cookie-banner-title"
      role="region"
      status="information"
      variant="lighter"
      onDismiss={() => {
        /* product: defer / snooze — follow local privacy rules */
      }}
    >
      <Banner.Content>
        <Banner.Icon as={Cookie} aria-hidden />
        <Banner.Title id="cookie-banner-title">Cookies and similar technologies</Banner.Title>
        <Banner.Description>
          We use cookies to run the site, remember preferences, and measure usage. See our policy
          for details.
        </Banner.Description>
        <Banner.Actions>
          <Button.Root size="s" type="button" variant="primary">
            Accept essential
          </Button.Root>
          <LinkButton.Root href="/settings/cookies" size="s">
            Manage preferences
          </LinkButton.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
