import { Info } from "lucide-react";
import { Banner, Button } from "prime-ui-kit";
import { useState } from "react";

/** Show and hide by mounting the root; external control restores the strip (no `open` prop). */
export default function BannerControlledVisibilityExample() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {!visible ? (
        <Button.Root size="s" type="button" variant="neutral" onClick={() => setVisible(true)}>
          Show announcement
        </Button.Root>
      ) : null}
      {visible ? (
        <Banner.Root size="m" status="feature" variant="lighter">
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>Controlled visibility</Banner.Title>
            <Banner.Description>
              Removing the node from the tree hides the banner; use parent state to show it again.
            </Banner.Description>
            <Banner.Actions>
              <Button.Root mode="ghost" size="s" type="button" variant="neutral">
                Learn more
              </Button.Root>
              <Button.Root
                size="s"
                type="button"
                variant="primary"
                onClick={() => setVisible(false)}
              >
                Hide
              </Button.Root>
            </Banner.Actions>
          </Banner.Content>
        </Banner.Root>
      ) : null}
    </>
  );
}
