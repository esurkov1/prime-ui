import { LinkButton } from "prime-ui-kit";

/** External URL in a new tab — mirrors [`playground/snippets/link-button/external-link.tsx`](../../../../playground/snippets/link-button/external-link.tsx); always set <code>rel="noopener noreferrer"</code> with <code>target="_blank"</code>. */
export default function LinkButtonExternalExample() {
  return (
    <p>
      Documentation in a separate tab:{" "}
      <LinkButton.Root href="https://example.com/docs" target="_blank" rel="noopener noreferrer">
        Open help
      </LinkButton.Root>
    </p>
  );
}
