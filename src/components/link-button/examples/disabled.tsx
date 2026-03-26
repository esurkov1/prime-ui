import { LinkButton } from "prime-ui-kit";

/**
 * Disabled link is a <code>span</code> with <code>role="link"</code> — no <code>href</code>, anchor props are not applied.
 * Do not use for “still focusable”; use <code>aria-disabled</code> on a real control pattern if that is required.
 */
export default function LinkButtonDisabledExample() {
  return (
    <div>
      <LinkButton.Root href="/available" size="m">
        Available route
      </LinkButton.Root>
      <LinkButton.Root href="/ignored-when-disabled" size="m" disabled>
        Coming soon
      </LinkButton.Root>
    </div>
  );
}
