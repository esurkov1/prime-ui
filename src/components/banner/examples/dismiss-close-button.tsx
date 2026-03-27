import { CheckCircle2 } from "lucide-react";

import { Banner } from "prime-ui-kit";

/**
 * Explicit `Banner.CloseButton` as a direct child of `Banner.Root` (sibling of `Banner.Content`).
 * No `onDismiss` on the root — the kit does not inject a second close control.
 */
export default function BannerDismissCloseButtonExample() {
  return (
    <Banner.Root status="success" variant="lighter">
      <Banner.Content>
        <Banner.Icon as={CheckCircle2} aria-hidden />
        <Banner.Title>Changes saved</Banner.Title>
        <Banner.Description>Your profile was updated successfully.</Banner.Description>
      </Banner.Content>
      <Banner.CloseButton
        aria-label="Dismiss confirmation"
        type="button"
        onClick={() => {
          /* product: hide banner */
        }}
      />
    </Banner.Root>
  );
}
