import { LinkButton } from "prime-ui-kit";

/** Inline link inside body copy: same line as surrounding text, default control tier. */
export default function LinkButtonInlineTextLinkExample() {
  return (
    <p>
      Need more detail? See{" "}
      <LinkButton.Root href="/docs/billing" size="m">
        billing documentation
      </LinkButton.Root>{" "}
      for proration rules.
    </p>
  );
}
